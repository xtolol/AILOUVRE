/*
 * Positions five artwork previews and two hidden buffers around a virtual cursor.
 */
import ArtworkCard from "./ArtworkCard.jsx";
import styles from "../styles/GalleryGrid.module.css";

const PREVIEW_OFFSETS = [-3, -2, -1, 0, 1, 2, 3];

/**
 * Keeps keyed artwork frames mounted while they slide between carousel positions.
 * @param {{ artworks: Array<import("../data/demoGallery.js").DemoArtwork|import("../contracts/generation.js").GenerationSlot>, cursor: number, id: string }} props The demo entries or generation slots, virtual selection and controlled gallery identifier.
 * @returns {import("react").ReactElement|null} The artwork strip, or nothing for an empty list.
 */
export default function GalleryGrid({ artworks, cursor, id }) {
  if (artworks.length === 0) {
    return null;
  }

  const offsets = artworks.length === 1 ? [0] : PREVIEW_OFFSETS;

  /**
   * Maps a stable virtual position onto a circular image entry and visual offset.
   * @param {number} offset The frame's position relative to the selected artwork.
   * @returns {import("react").ReactElement} The positioned artwork list item.
   */
  function renderArtwork(offset) {
    const virtualPosition = cursor + offset;
    const artworkIndex =
      ((virtualPosition % artworks.length) + artworks.length) % artworks.length;

    return (
      <li
        className={styles.item}
        data-position={offset}
        aria-hidden={offset !== 0}
        aria-posinset={offset === 0 ? artworkIndex + 1 : undefined}
        aria-setsize={offset === 0 ? artworks.length : undefined}
        key={virtualPosition}
      >
        <ArtworkCard artwork={artworks[artworkIndex]} featured={offset === 0} />
      </li>
    );
  }

  return (
    <div className={styles.viewport} id={id}>
      <ul className={styles.strip} role="list">
        {offsets.map(renderArtwork)}
      </ul>
    </div>
  );
}
