/*
 * Reserves AILOUVRE's Jev adapter for OpenRouter's separate Decisions API
 * at POST /api/alpha/decisions, using the same server-only OpenRouter key.
 * Image input preparation and typed-answer mapping are unimplemented.
 */
import "server-only";

/**
 * @param {{ model: string, state: unknown, questions: Object<string, unknown> }} options
 * @returns {Promise<{ answers: Object<string, unknown>, usage: import("../../contracts/gallery.js").Usage|null }>}
 */
export async function requestJudgment({ model, state, questions }) {
  throw new Error("Not implemented");
}
