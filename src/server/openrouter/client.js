/*
 * Provides authenticated, buffered OpenRouter requests with a bounded timeout
 * and sanitized failures. Credentials are read only when a request is made.
 */
import "server-only";
import { OpenRouterError } from "./errors.js";

const OPENROUTER_API_BASE = "https://openrouter.ai/api/v1";
const REQUEST_TIMEOUT_MS = 180_000;

/**
 * Accepts bounded diagnostic identifiers and header values while excluding objects and control characters.
 * @param {unknown} value An upstream diagnostic value.
 * @returns {string|null} A short plain value or null when absent or unsuitable.
 */
function diagnosticValue(value) {
  const text = typeof value === "number" && Number.isFinite(value)
    ? String(value)
    : typeof value === "string" ? value.trim() : "";
  return /^[A-Za-z0-9_ .:/,+-]{1,160}$/.test(text) ? text : null;
}

/**
 * Collects selected 429 diagnostics without retaining raw provider messages or request content.
 * @param {unknown} error The provider's parsed error object, if readable.
 * @param {Headers} headers The upstream response headers.
 * @returns {import("../../contracts/generation.js").GenerationRateLimitMetadata} Nullable diagnostics and the retry hint.
 */
function rateLimitMetadata(error, headers) {
  const metadata = error?.metadata;
  return {
    retryAfter: diagnosticValue(headers.get("Retry-After")),
    errorType: diagnosticValue(metadata?.error_type),
    providerName: diagnosticValue(metadata?.provider_name),
    providerCode: diagnosticValue(metadata?.provider_code),
    limitSource: diagnosticValue(metadata?.limit_source),
    reason: diagnosticValue(metadata?.reason),
    rateLimitLimit: diagnosticValue(headers.get("X-RateLimit-Limit")),
    rateLimitRemaining: diagnosticValue(headers.get("X-RateLimit-Remaining")),
    rateLimitReset: diagnosticValue(headers.get("X-RateLimit-Reset")),
  };
}

/**
 * Maps provider HTTP failures to fixed messages without copying response bodies.
 * @param {number} status The upstream HTTP or embedded error status.
 * @param {import("../../contracts/generation.js").GenerationRateLimitMetadata|null} [metadata] Selected diagnostics for a rate-limit failure.
 * @returns {OpenRouterError} A safe error for the preview route.
 */
function providerError(status, metadata = null) {
  if (status === 402) {
    return new OpenRouterError("insufficient_credits", "OpenRouter has insufficient credits for generation.", 402);
  }
  if (status === 429) {
    return new OpenRouterError("rate_limited", "OpenRouter is rate limiting generation. Try again later.", 429, metadata);
  }
  if (status === 408 || status === 504) {
    return new OpenRouterError("generation_timeout", "Image generation timed out. No automatic retry was made.", 504);
  }
  if (status === 401 || status === 403) {
    return new OpenRouterError("provider_authentication", "OpenRouter could not authenticate this server's generation request.", 502);
  }
  return new OpenRouterError("provider_failure", "OpenRouter could not complete image generation. No automatic retry was made.", 502);
}

/**
 * Sends one server-authenticated request to OpenRouter without retrying failures.
 * @param {{ endpoint: string, body: Object<string, unknown> }} options The internal API path and trusted request body.
 * @returns {Promise<Object<string, unknown>>} The parsed provider JSON object.
 */
export async function requestOpenRouter({ endpoint, body }) {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    throw new OpenRouterError("missing_api_key", "Set the server-only OPENROUTER_API_KEY before generating images.", 503);
  }

  try {
    const response = await fetch(`${OPENROUTER_API_BASE}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (response.status === 429) {
      let error = null;
      try {
        error = (await response.json())?.error;
      } catch {
        // Keep the HTTP status and headers even when the error body is unreadable.
      }
      throw providerError(429, rateLimitMetadata(error, response.headers));
    }
    if (!response.ok) {
      throw providerError(response.status);
    }

    const result = await response.json();
    if (!result || typeof result !== "object" || Array.isArray(result)) {
      throw new OpenRouterError("invalid_response", "OpenRouter returned an invalid generation response.", 502);
    }
    if (result.error) {
      const status = Number(result.error.code);
      throw providerError(status, status === 429 ? rateLimitMetadata(result.error, response.headers) : null);
    }
    return result;
  } catch (error) {
    if (error instanceof OpenRouterError) {
      throw error;
    }
    if (error?.name === "TimeoutError" || error?.name === "AbortError") {
      throw providerError(504);
    }
    if (error instanceof SyntaxError) {
      throw new OpenRouterError("invalid_response", "OpenRouter returned an invalid generation response.", 502);
    }
    throw new OpenRouterError("provider_unavailable", "Could not reach OpenRouter. No automatic retry was made.", 502);
  }
}
