/*
 * Reserves a read-only HTTP entry point for an AILOUVRE exhibition by date.
 * This route is unconnected and fails explicitly until reading is implemented.
 */
import "server-only";

/**
 * @param {Request} request
 * @param {{ params: Promise<{ date: string }> }} context
 * @returns {Promise<Response>} Future exhibition response.
 */
export async function GET(request, context) {
  throw new Error("Not implemented");
}
