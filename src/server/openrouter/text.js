/*
 * Reserves AILOUVRE's optional LLM theme-generation adapter through
 * OpenRouter chat completions at POST /api/v1/chat/completions.
 * No text model or theme prompt is selected or called by this scaffold.
 */
import "server-only";

/**
 * @param {{ model: string, instructions: string }} options
 * @returns {Promise<{ text: string, usage: import("../../contracts/gallery.js").Usage|null }>}
 */
export async function requestTheme({ model, instructions }) {
  throw new Error("Not implemented");
}
