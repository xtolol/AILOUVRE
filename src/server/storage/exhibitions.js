/*
 * Reserves durable exhibition reading and writing for AILOUVRE.
 * A future storage implementation will save judged exhibitions before
 * publication; no database, filesystem access, or vendor is configured.
 */
import "server-only";

/**
 * @param {{ date: import("../../contracts/gallery.js").ExhibitionDate }} options
 * @returns {Promise<import("../../contracts/gallery.js").Exhibition|null>}
 */
export async function getExhibition({ date }) {
  throw new Error("Not implemented");
}

/**
 * @param {{ exhibition: import("../../contracts/gallery.js").Exhibition }} options
 * @returns {Promise<import("../../contracts/gallery.js").Exhibition>}
 */
export async function saveExhibition({ exhibition }) {
  throw new Error("Not implemented");
}
