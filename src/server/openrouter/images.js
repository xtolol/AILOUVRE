/*
 * Requests one OpenRouter image and validates its bytes before exposing a
 * temporary preview. No image persistence, retries or model fallbacks occur.
 */
import "server-only";
import sharp from "sharp";
import { requestOpenRouter } from "./client.js";
import { OpenRouterError } from "./errors.js";

const MEDIA_TYPES = {
  png: "image/png",
  jpeg: "image/jpeg",
  webp: "image/webp",
};

/**
 * Converts a reported finite nonnegative usage value without inventing defaults.
 * @param {unknown} value A provider usage field.
 * @returns {number|null} The reported value or null when unknown.
 */
function usageNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}

/**
 * Normalizes optional OpenRouter usage into the gallery's nullable usage fields.
 * @param {unknown} usage The provider usage object, if present.
 * @returns {import("../../contracts/gallery.js").Usage|null} Known usage or null.
 */
function normalizeUsage(usage) {
  if (!usage || typeof usage !== "object" || Array.isArray(usage)) {
    return null;
  }
  return {
    inputTokens: usageNumber(usage.prompt_tokens),
    outputTokens: usageNumber(usage.completion_tokens),
    costUsd: usageNumber(usage.cost),
  };
}

/**
 * Decodes and checks the actual image pixels, preserving the original image bytes.
 * @param {unknown} image The first item of the provider's data array.
 * @returns {Promise<import("../../contracts/generation.js").GenerationPreviewImage>} Validated PNG, JPEG or WebP bytes.
 */
async function validateImage(image) {
  try {
    if (typeof image?.b64_json !== "string") {
      throw new Error("Missing image bytes");
    }
    const base64 = image.b64_json.replace(/\s/g, "");
    if (!base64 || !/^[A-Za-z0-9+/]+={0,2}$/.test(base64)) {
      throw new Error("Invalid base64");
    }
    const bytes = Buffer.from(base64, "base64");
    const canonicalBase64 = bytes.toString("base64");
    if (canonicalBase64.replace(/=+$/, "") !== base64.replace(/=+$/, "")) {
      throw new Error("Invalid base64 bytes");
    }

    const decoder = sharp(bytes, { failOn: "warning" });
    const metadata = await decoder.metadata();
    const mediaType = MEDIA_TYPES[metadata.format];
    if (!mediaType || !(metadata.width > 0) || !(metadata.height > 0)) {
      throw new Error("Unsupported image format or dimensions");
    }
    if (image.media_type != null && image.media_type !== mediaType) {
      throw new Error("Image media type does not match its bytes");
    }
    // Metadata alone reads headers; pixel statistics require a full image decode.
    await decoder.stats();
    return { base64: canonicalBase64, mediaType };
  } catch {
    throw new OpenRouterError("invalid_image", "OpenRouter did not return a usable PNG, JPEG or WebP image.", 502);
  }
}

/**
 * Generates one image with the supplied server settings and normalizes its result.
 * @param {{ model: string, prompt: string, settings: import("../../contracts/generation.js").ImageGenerationSettings }} options Trusted model, prompt and shared settings.
 * @returns {Promise<{ image: import("../../contracts/generation.js").GenerationPreviewImage, providerRequestId: string|null, usage: import("../../contracts/gallery.js").Usage|null }>} Validated image and reported metadata.
 */
export async function requestImageGeneration({ model, prompt, settings }) {
  const result = await requestOpenRouter({
    endpoint: "/images",
    body: { model, prompt, ...settings },
  });
  const image = await validateImage(Array.isArray(result.data) ? result.data[0] : null);
  return {
    image,
    providerRequestId: typeof result.id === "string" && result.id.trim() ? result.id : null,
    usage: normalizeUsage(result.usage),
  };
}
