/*
 * Reserves the first step of AILOUVRE's daily process: resolve a human
 * or LLM theme into a shared brief. It does not call adapters or storage.
 */
import "server-only";

/**
 * @param {{ date: import("../../contracts/gallery.js").ExhibitionDate, humanTheme?: string }} options
 * @returns {Promise<import("../../contracts/gallery.js").DailyBrief>}
 */
export async function resolveDailyTheme({ date, humanTheme }) {
  throw new Error("Not implemented");
}
