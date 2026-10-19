/*
 * Documents the data exchanged by AILOUVRE's future pages, services,
 * OpenRouter adapters, and storage modules. These are JSDoc types only;
 * this module performs no validation, persistence, or schema migrations.
 */

/**
 * A local exhibition date in YYYY-MM-DD form. The future daily boundary
 * is Europe/London; this typedef does not parse, format, or validate dates.
 * @typedef {string} ExhibitionDate
 */

/**
 * Provider-reported resource use. USD costs may be unavailable until measured;
 * unknown values are null, never implied to be zero.
 * @typedef {Object} Usage
 * @property {number|null} inputTokens
 * @property {number|null} outputTokens
 * @property {number|null} costUsd
 */

/**
 * @typedef {Object} DailyBrief
 * @property {string} id
 * @property {ExhibitionDate} date
 * @property {string} theme
 * @property {string} prompt The shared creative brief sent to image generators.
 * @property {string[]} requirements Visible requirements reserved for judging.
 * @property {"human"|"llm"} source
 * @property {string|null} sourceModelId Model provenance for an LLM-authored theme.
 * @property {Usage|null} usage Theme-generation usage, if applicable.
 */

/**
 * @typedef {Object} DimensionScore
 * @property {string} dimensionId
 * @property {number|null} score No score range is prescribed by this scaffold.
 * @property {number|null} confidence An answer signal, not guaranteed correctness.
 * @property {Object<string, number>|null} probabilities
 */

/**
 * @typedef {Object} Judgment
 * @property {string} id
 * @property {string} artworkId
 * @property {string} judgeModelId
 * @property {string} rubricVersion Provenance for future question definitions.
 * @property {DimensionScore[]} scores Separate dimensions; no combined ranking.
 * @property {Usage|null} usage
 */

/**
 * @typedef {Object} Artwork
 * @property {string} id
 * @property {string} exhibitionId
 * @property {string} modelId
 * @property {string} prompt Exact generation prompt for reproducibility.
 * @property {Object<string, unknown>} settings Actual generation settings.
 * @property {string|null} providerRequestId
 * @property {string|null} imageId Durable image-storage identifier.
 * @property {string|null} imageUrl
 * @property {Usage|null} usage
 * @property {Judgment|null} judgment
 */

/**
 * @typedef {Object} Exhibition
 * @property {string} id
 * @property {ExhibitionDate} date
 * @property {"draft"|"published"} status
 * @property {DailyBrief} brief
 * @property {Artwork[]} artworks
 * @property {string|null} publishedAt Future ISO timestamp; no clock is read here.
 * @property {Usage|null} usage Aggregate usage, when known.
 */

export {};
