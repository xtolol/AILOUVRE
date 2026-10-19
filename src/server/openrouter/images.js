/*
 * Reserves AILOUVRE's adapter for OpenRouter image generation at
 * POST /api/v1/images. Provider request and response mapping is unimplemented.
 */
import "server-only";

/**
 * @param {{ model: string, prompt: string, settings: Object<string, unknown> }} options
 * @returns {Promise<{ image: unknown, providerRequestId: string|null, usage: import("../../contracts/gallery.js").Usage|null }>}
 */
export async function requestImageGeneration({ model, prompt, settings }) {
  throw new Error("Not implemented");
}
