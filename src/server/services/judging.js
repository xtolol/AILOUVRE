/*
 * Reserves question preparation and per-artwork Jev evaluation after
 * AILOUVRE's images are saved. Dimensions stay separate; rubric wording,
 * weighting, ranking, adapter calls, and persistence are unimplemented.
 */
import "server-only";

/**
 * @param {{ brief: import("../../contracts/gallery.js").DailyBrief }} options
 * @returns {Promise<Object<string, unknown>>} Future typed judging questions.
 */
export async function buildJudgingQuestions({ brief }) {
  throw new Error("Not implemented");
}

/**
 * @param {{ artwork: import("../../contracts/gallery.js").Artwork, brief: import("../../contracts/gallery.js").DailyBrief }} options
 * @returns {Promise<import("../../contracts/gallery.js").Judgment>}
 */
export async function judgeArtwork({ artwork, brief }) {
  throw new Error("Not implemented");
}
