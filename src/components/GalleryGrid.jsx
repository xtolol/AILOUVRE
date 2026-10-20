/*
 * Arranges five static artwork previews around the larger featured frame.
 */
import ArtworkCard from "./ArtworkCard.jsx";
import styles from "../styles/GalleryGrid.module.css";

/**
 * Renders the carousel-shaped composition without interactive controls.
 * @param {{ artworks: import("../data/demoGallery.js").DemoArtwork[], featuredArtworkId: string }} props The ordered preview images and centered artwork identifier.
 * @returns {import("react").ReactElement} The clipped artwork preview strip.
 */
export default function GalleryGrid({ artworks, featuredArtworkId }) {
  /**
   * Finds the preview entry that anchors the center of the composition.
   * @param {import("../data/demoGallery.js").DemoArtwork} artwork The entry to inspect.
   * @returns {boolean} Whether the entry is the featured artwork.
   */
  function isFeaturedArtwork(artwork) {
    return artwork.id === featuredArtworkId;
  }

  const featuredIndex = artworks.findIndex(isFeaturedArtwork);

  /**
   * Places an artwork relative to the fixed featured image in the preview list.
   * @param {import("../data/demoGallery.js").DemoArtwork} artwork The image presentation data.
   * @param {number} index The entry's position in the ordered preview list.
   * @returns {import("react").ReactElement} The positioned artwork list item.
   */
  function renderArtwork(artwork, index) {
    return (
      <li
        className={styles.item}
        data-position={index - featuredIndex}
        key={artwork.id}
      >
        <ArtworkCard artwork={artwork} featured={index === featuredIndex} />
      </li>
    );
  }

  return (
    <section className={styles.viewport} aria-label="Artwork preview">
      <ul className={styles.strip} role="list">
        {artworks.map(renderArtwork)}
      </ul>
    </section>
  );
}
