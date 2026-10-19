/*
 * Reserves candidate generation from AILOUVRE's shared daily brief and
 * selected models, before image storage and judging. No adapters are called.
 */
import "server-only";

/**
 * @param {{ exhibitionId: string, brief: import("../../contracts/gallery.js").DailyBrief, models: Array<{ id: string, name: string }>, imagesPerModel: number }} options
 * @returns {Promise<Array<{ artwork: import("../../contracts/gallery.js").Artwork, image: unknown }>>}
 */
export async function generateCandidates({ exhibitionId, brief, models, imagesPerModel }) {
  throw new Error("Not implemented");
}
