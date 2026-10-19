/*
 * Reserves AILOUVRE's daily orchestration: resolve theme -> generate
 * candidates -> save images -> judge candidates -> save exhibition -> publish.
 * This sequence is documentation only; the stub calls no services.
 */
import "server-only";

/**
 * @param {{ date: import("../../contracts/gallery.js").ExhibitionDate, humanTheme?: string }} options
 * @returns {Promise<import("../../contracts/gallery.js").Exhibition>}
 */
export async function runDailyExhibition({ date, humanTheme }) {
  throw new Error("Not implemented");
}
