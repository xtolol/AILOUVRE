/*
 * Documents model configuration, request results and temporary browser slots
 * for AILOUVRE's generation experiment. These JSDoc contracts are separate from
 * published gallery records and perform no runtime validation or persistence.
 */

/**
 * A configured image model and its eligibility for this Image API experiment.
 * @typedef {Object} ImageModel
 * @property {string} id The exact OpenRouter model identifier.
 * @property {string} name The model name shown in the gallery.
 * @property {boolean} imageApiEnabled Whether this experiment may request the model.
 */

/**
 * The common request settings shared by the four enabled image models.
 * @typedef {Object} ImageGenerationSettings
 * @property {"1:1"} aspect_ratio The requested square composition, not an exact pixel size.
 * @property {1} n The number of images requested from a model per call.
 * @property {false} stream Buffered JSON responses rather than streamed previews.
 */

/**
 * The only browser-supplied field accepted by the development preview endpoint.
 * @typedef {Object} GenerationPreviewRequest
 * @property {string} modelId A model identifier checked against server configuration.
 */

/**
 * A validated image returned to the browser without writing it to durable storage.
 * @typedef {Object} GenerationPreviewImage
 * @property {string} base64 The encoded image bytes, without a data URL prefix.
 * @property {"image/png"|"image/jpeg"|"image/webp"} mediaType The validated image format.
 */

/**
 * A single model's normalized generation result, separate from published Artwork.
 * @typedef {Object} GenerationPreviewResult
 * @property {string} modelId The model that was requested.
 * @property {string} prompt The exact prompt sent to OpenRouter.
 * @property {ImageGenerationSettings} requestedSettings The explicit settings sent; unreported provider defaults remain unknown.
 * @property {GenerationPreviewImage} image The generated image before browser decoding.
 * @property {string|null} providerRequestId The returned request identifier, if available.
 * @property {import("./gallery.js").Usage|null} usage Reported usage; missing values remain null rather than zero.
 */

/**
 * Selected rate-limit diagnostics, separate from raw provider errors and prompt content.
 * @typedef {Object} GenerationRateLimitMetadata
 * @property {string|null} retryAfter The upstream Retry-After value, in seconds or HTTP-date form.
 * @property {string|null} errorType The upstream machine-readable error type.
 * @property {string|null} providerName The provider named in the upstream error.
 * @property {string|null} providerCode The provider's error code, normalized to a string.
 * @property {string|null} limitSource The upstream limit source, when reported.
 * @property {string|null} reason The upstream machine-readable reason, when reported.
 * @property {string|null} rateLimitLimit The upstream X-RateLimit-Limit header.
 * @property {string|null} rateLimitRemaining The upstream X-RateLimit-Remaining header.
 * @property {string|null} rateLimitReset The upstream X-RateLimit-Reset header.
 */

/**
 * A sanitized HTTP failure without raw provider responses or credentials.
 * @typedef {Object} GenerationPreviewErrorResponse
 * @property {{ code: string, message: string, metadata?: GenerationRateLimitMetadata }} error The application error identifier, safe display message and selected diagnostics for 429s.
 */

/**
 * Result metadata retained in a slot after its encoded image becomes a Blob URL.
 * Omit excludes the image field so React state does not retain duplicate image bytes.
 * @typedef {Omit<GenerationPreviewResult, "image">} GenerationPreviewMetadata
 */

/**
 * The lifecycle of one stable model slot during a sequential generation batch.
 * @typedef {"idle"|"queued"|"generating"|"ready"|"error"} GenerationSlotStatus
 */

/**
 * Temporary browser state for one configured model; results reset on page reload.
 * @typedef {Object} GenerationSlot
 * @property {string} id The model identifier, retained as the stable slot identity.
 * @property {string} modelName The model's display name.
 * @property {GenerationSlotStatus} status The current generation state.
 * @property {string|null} src A temporary Blob URL owned and revoked by the browser component.
 * @property {number|null} width The actual decoded image width, populated when ready.
 * @property {number|null} height The actual decoded image height, populated when ready.
 * @property {GenerationPreviewMetadata|null} generation The prompt, sent settings and returned metadata.
 * @property {string|null} error A sanitized display message when generation fails.
 * @property {null} ratings No Jev judgment or personal vote exists in this experiment.
 */

export {};
