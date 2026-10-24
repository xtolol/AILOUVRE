/* Presents navigation, the selected model's generation status and available ratings. */
import { GENERATION_STATUS_LABELS } from "../client/generation.js";
import ScoreBreakdown from "./ScoreBreakdown.jsx";
import styles from "../styles/ArtworkDetails.module.css";

/**
 * Renders accessible arrow controls and synchronized details for the selected entry.
 * @param {{ artwork: import("../data/demoGallery.js").DemoArtwork|import("../contracts/generation.js").GenerationSlot, position: number, total: number, onPrevious: () => void, onNext: () => void, transitioning: boolean, galleryId: string }} props The selected entry, navigation callbacks and transition state.
 * @returns {import("react").ReactElement} The carousel controls and artwork details.
 */
export default function ArtworkDetails({
  artwork,
  position,
  total,
  onPrevious,
  onNext,
  transitioning,
  galleryId,
}) {
  return (
    <section className={styles.details} aria-label="Featured artwork details">
      <div className={styles.position}>
        <button
          className={styles.arrowButton}
          type="button"
          aria-label="Previous artwork"
          aria-controls={galleryId}
          aria-disabled={transitioning || total < 2}
          disabled={total < 2}
          onClick={onPrevious}
        >
          <svg
            className={styles.arrow}
            viewBox="0 0 64 32"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M60 19C44 14 28 12 4 16M21 5 4 16l18 11" />
          </svg>
        </button>
        <p className={styles.counter} role="status" aria-atomic="true">
          <span className={styles.screenReaderOnly}>
            Artwork {position} of {total}: {artwork.modelName}
          </span>
          <span aria-hidden="true">
            {String(position).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </p>
        <button
          className={styles.arrowButton}
          type="button"
          aria-label="Next artwork"
          aria-controls={galleryId}
          aria-disabled={transitioning || total < 2}
          disabled={total < 2}
          onClick={onNext}
        >
          <svg
            className={styles.arrow}
            viewBox="0 0 64 32"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M4 19c16-5 32-7 56-3M43 5l17 11-18 11" />
          </svg>
        </button>
      </div>

      <h2 className={styles.modelName}>{artwork.modelName}</h2>
      {artwork.status && (
        <p className={styles.generationStatus} role="status" aria-atomic="true">
          {GENERATION_STATUS_LABELS[artwork.status]}
          {artwork.error && <span className={styles.errorMessage}>{artwork.error}</span>}
        </p>
      )}
      <ScoreBreakdown ratings={artwork.ratings} />
    </section>
  );
}
