/* Exposes the development-only image experiment using server-owned models and settings. */
import "server-only";
import { IMAGE_MODELS } from "../../../config/models.js";
import { IMAGE_GENERATION_SETTINGS, TEST_GENERATION_PROMPT } from "../../../config/generation.js";
import { requestImageGeneration } from "../../../server/openrouter/images.js";
import { OpenRouterError } from "../../../server/openrouter/errors.js";

export const runtime = "nodejs";

/**
 * Returns a noncacheable JSON preview error with a fixed application message.
 * @param {string} code The stable error identifier.
 * @param {string} message The sanitized display message.
 * @param {number} status The response's HTTP status.
 * @param {import("../../../contracts/generation.js").GenerationRateLimitMetadata|null} [metadata] Selected 429 diagnostics and the upstream retry hint.
 * @returns {Response} A JSON failure containing only safe messages and selected diagnostics.
 */
function errorResponse(code, message, status, metadata = null) {
  const error = { code, message };
  const headers = { "Cache-Control": "no-store" };
  if (status === 429 && metadata) {
    error.metadata = metadata;
    if (metadata.retryAfter) {
      headers["Retry-After"] = metadata.retryAfter;
    }
  }
  return Response.json({ error }, { status, headers });
}

/**
 * Generates a preview for one eligible model in development using fixed server settings.
 * @param {Request} request A JSON request containing only a modelId.
 * @returns {Promise<Response>} A GenerationPreviewResult or sanitized JSON error.
 */
export async function POST(request) {
  if (process.env.NODE_ENV !== "development") {
    return errorResponse("not_found", "Generation previews are available only in development.", 404);
  }
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return errorResponse("invalid_content_type", "Send the model ID as application/json.", 415);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse("invalid_request", "Send a JSON object containing only modelId.", 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body) ||
      Object.keys(body).length !== 1 || typeof body.modelId !== "string") {
    return errorResponse("invalid_request", "Send a JSON object containing only modelId.", 400);
  }

  /**
   * Matches the requested identifier to a configured model eligible for this experiment.
   * @param {import("../../../contracts/generation.js").ImageModel} model A configured model.
   * @returns {boolean} Whether the model may be requested.
   */
  function isRequestedModel(model) {
    return model.id === body.modelId && model.imageApiEnabled;
  }
  const selectedModel = IMAGE_MODELS.find(isRequestedModel);
  if (!selectedModel) {
    return errorResponse("unsupported_model", "Choose a model enabled for this Image API experiment.", 400);
  }

  try {
    const settings = { ...IMAGE_GENERATION_SETTINGS };
    const result = await requestImageGeneration({
      model: selectedModel.id,
      prompt: TEST_GENERATION_PROMPT,
      settings,
    });
    return Response.json({
      modelId: selectedModel.id,
      prompt: TEST_GENERATION_PROMPT,
      requestedSettings: settings,
      ...result,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof OpenRouterError) {
      return errorResponse(error.code, error.message, error.status, error.metadata);
    }
    return errorResponse("generation_failed", "Image generation could not be completed.", 500);
  }
}
