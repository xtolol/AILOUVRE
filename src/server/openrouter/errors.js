/* Defines safe, categorized OpenRouter failures that the preview route may expose. */
import "server-only";

export class OpenRouterError extends Error {
  /**
   * Carries a fixed display message, HTTP status and optional selected rate-limit diagnostics.
   * @param {string} code A stable application error identifier.
   * @param {string} message A sanitized message authored by this application.
   * @param {number} status The HTTP status returned by the preview route.
   * @param {import("../../contracts/generation.js").GenerationRateLimitMetadata|null} [metadata] Allowlisted diagnostics from a rate-limit response.
   * @returns {OpenRouterError} The categorized failure.
   */
  constructor(code, message, status, metadata = null) {
    super(message);
    this.name = "OpenRouterError";
    this.code = code;
    this.status = status;
    this.metadata = metadata;
  }
}
