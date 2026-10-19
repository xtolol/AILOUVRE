/*
 * Reserves shared, authenticated OpenRouter request handling for AILOUVRE.
 * Image, text, and decision adapters will share one server-only account/key;
 * this stub reads no credentials and performs no network requests.
 */
import "server-only";

/**
 * @param {{ endpoint: string, body: Object<string, unknown> }} options
 * @returns {Promise<Object<string, unknown>>} Future provider response.
 */
export async function requestOpenRouter({ endpoint, body }) {
  throw new Error("Not implemented");
}
