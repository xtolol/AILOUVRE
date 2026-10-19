/*
 * Reserves AILOUVRE's public exhibition read boundary and final publication
 * step after generation, image storage, judging, and exhibition storage.
 * Neither function reads, writes, or publishes anything in this scaffold.
 */
import "server-only";

/**
 * @param {{ date: import("../../contracts/gallery.js").ExhibitionDate }} options
 * @returns {Promise<import("../../contracts/gallery.js").Exhibition|null>}
 */
export async function getDailyExhibition({ date }) {
  throw new Error("Not implemented");
}

/**
 * @param {{ exhibitionId: string }} options
 * @returns {Promise<import("../../contracts/gallery.js").Exhibition>}
 */
export async function publishExhibition({ exhibitionId }) {
  throw new Error("Not implemented");
}
