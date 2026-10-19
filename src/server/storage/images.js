/*
 * Reserves AILOUVRE's durable image storage between candidate generation
 * and judging. Image saving and public URL resolution have no implementation
 * or storage provider, and make no reads, writes, or uploads.
 */
import "server-only";

/**
 * @param {{ image: unknown, artworkId: string }} options
 * @returns {Promise<{ imageId: string, imageUrl: string }>}
 */
export async function saveImage({ image, artworkId }) {
  throw new Error("Not implemented");
}

/**
 * @param {{ imageId: string }} options
 * @returns {Promise<string|null>}
 */
export async function getImageUrl({ imageId }) {
  throw new Error("Not implemented");
}
