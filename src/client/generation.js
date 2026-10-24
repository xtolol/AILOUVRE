/* Requests temporary previews and decodes their images only after an explicit browser action. */

const MAX_GENERATION_ATTEMPTS = 3;
const RATE_LIMIT_RETRY_DELAY_MS = 30_000;
const MAX_TIMER_DELAY_MS = 2_147_483_647;

export const GENERATION_STATUS_LABELS = {
  idle: "Not generated",
  queued: "Queued",
  generating: "Generating image…",
  ready: "Image ready",
  error: "Generation failed",
};

/**
 * Derives the retry wait from an upstream seconds or HTTP-date hint with a thirty-second minimum.
 * @param {unknown} retryAfter The forwarded Retry-After header or error metadata value.
 * @returns {number} The retry delay in milliseconds, falling back to thirty seconds for invalid hints.
 */
function rateLimitRetryDelay(retryAfter) {
  if (typeof retryAfter !== "string" || !retryAfter.trim()) {
    return RATE_LIMIT_RETRY_DELAY_MS;
  }
  const value = retryAfter.trim();
  const delayMs = /^\d+$/.test(value)
    ? Number(value) * 1000
    : Date.parse(value) - Date.now();
  return Number.isSafeInteger(delayMs)
    ? Math.max(RATE_LIMIT_RETRY_DELAY_MS, delayMs)
    : RATE_LIMIT_RETRY_DELAY_MS;
}

/**
 * Waits for a rate-limit retry, cancelling its timer on batch abort and splitting oversized delays.
 * @param {AbortSignal} signal The current batch's cancellation signal.
 * @param {number} delayMs The validated delay before retrying.
 * @returns {Promise<void>} Resolves after the delay or rejects immediately on cancellation.
 */
function waitForRateLimitRetry(signal, delayMs) {
  /**
   * Schedules a retry delay and releases its abort listener when the wait ends.
   * @param {() => void} resolve Completes the wait after the requested delay.
   * @param {(reason: unknown) => void} reject Cancels the wait with the batch's abort reason.
   * @returns {void} No value is returned.
   */
  function scheduleRetry(resolve, reject) {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }
    const startedAt = performance.now();
    let timer;

    /**
     * Reschedules long waits within browser timer limits or completes the retry delay.
     * @returns {void} No value is returned.
     */
    function finishWait() {
      const remainingMs = delayMs - (performance.now() - startedAt);
      if (remainingMs > 0) {
        timer = window.setTimeout(finishWait, Math.min(remainingMs, MAX_TIMER_DELAY_MS));
        return;
      }
      signal.removeEventListener("abort", cancelRetry);
      resolve();
    }

    /**
     * Clears the pending retry so an unmounted gallery cannot send another request.
     * @returns {void} No value is returned.
     */
    function cancelRetry() {
      window.clearTimeout(timer);
      signal.removeEventListener("abort", cancelRetry);
      reject(signal.reason);
    }

    signal.addEventListener("abort", cancelRetry, { once: true });
    finishWait();
  }
  return new Promise(scheduleRetry);
}

/**
 * Requests a development preview with at most three attempts, honoring rate-limit retry hints.
 * @param {string} modelId The configured model identifier.
 * @param {AbortSignal} signal The current batch's cancellation signal.
 * @param {(progress: { attempt: number, maxAttempts: number, waitMs: number }) => void} [onAttempt] Reports each attempt or pending rate-limit retry to the gallery.
 * @returns {Promise<import("../contracts/generation.js").GenerationPreviewResult>} The server-validated preview result.
 */
export async function requestPreviewImage(modelId, signal, onAttempt) {
  for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt += 1) {
    signal.throwIfAborted();
    onAttempt?.({ attempt, maxAttempts: MAX_GENERATION_ATTEMPTS, waitMs: 0 });

    let response;
    try {
      response = await fetch("/api/generation-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelId }),
        cache: "no-store",
        signal,
      });
    } catch (error) {
      if (signal.aborted) {
        throw error;
      }
      throw new Error("Could not reach the generation endpoint. Network failures are not retried.");
    }

    let result;
    try {
      result = await response.json();
    } catch (error) {
      if (signal.aborted) {
        throw error;
      }
      if (response.status !== 429) {
        throw new Error("The generation endpoint returned an unreadable response.");
      }
      // A missing JSON error body must not hide a usable 429 retry header.
      result = null;
    }
    if (response.status === 429) {
      if (attempt === MAX_GENERATION_ATTEMPTS) {
        break;
      }
      const waitMs = rateLimitRetryDelay(
        response.headers.get("Retry-After") ?? result?.error?.metadata?.retryAfter,
      );
      onAttempt?.({ attempt: attempt + 1, maxAttempts: MAX_GENERATION_ATTEMPTS, waitMs });
      await waitForRateLimitRetry(signal, waitMs);
      continue;
    }
    if (!response.ok) {
      throw new Error(typeof result?.error?.message === "string"
        ? result.error.message
        : "Image generation could not be completed.");
    }
    if (result?.modelId !== modelId || typeof result?.image?.base64 !== "string" ||
        !["image/png", "image/jpeg", "image/webp"].includes(result?.image?.mediaType)) {
      throw new Error("The generation endpoint returned an invalid image result.");
    }
    return result;
  }
  throw new Error(`OpenRouter is still rate limiting this model after ${MAX_GENERATION_ATTEMPTS} attempts. Try again later.`);
}

/**
 * Creates a temporary browser image URL and reads its actual decoded dimensions.
 * @param {import("../contracts/generation.js").GenerationPreviewImage} image The encoded server-validated image.
 * @param {AbortSignal} signal The current batch's cancellation signal.
 * @returns {Promise<{ src: string, width: number, height: number }>} A decoded image whose URL the caller must revoke.
 */
export async function decodePreviewImage(image, signal) {
  let src;
  const decoder = new window.Image();

  /**
   * Stops an in-progress browser image decode when the batch is cancelled.
   * @returns {void} No value is returned.
   */
  function cancelDecode() {
    decoder.removeAttribute("src");
  }

  try {
    signal.throwIfAborted();
    const binary = window.atob(image.base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    src = URL.createObjectURL(new Blob([bytes], { type: image.mediaType }));
    signal.addEventListener("abort", cancelDecode, { once: true });
    decoder.src = src;
    await decoder.decode();
    signal.throwIfAborted();
    if (decoder.naturalWidth < 1 || decoder.naturalHeight < 1) {
      throw new Error("Missing image dimensions");
    }
    return { src, width: decoder.naturalWidth, height: decoder.naturalHeight };
  } catch (error) {
    if (src) {
      URL.revokeObjectURL(src);
    }
    if (signal.aborted) {
      throw error;
    }
    throw new Error("The generated image could not be decoded by this browser.");
  } finally {
    signal.removeEventListener("abort", cancelDecode);
  }
}
