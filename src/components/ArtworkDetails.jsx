/* Presents the featured artwork's static position, model caption and ratings. */
import ScoreBreakdown from "./ScoreBreakdown.jsx";
import styles from "../styles/ArtworkDetails.module.css";

/**
 * Renders the prototype's decorative navigation and featured artwork details.
 * @param {{ artwork: import("../data/demoGallery.js").DemoArtwork, position: number, total: number }} props The featured preview entry, its one-based position and the entry count.
 * @returns {import("react").ReactElement} The static artwork details section.
 */
export default function ArtworkDetails({ artwork, position, total }) {
  return (
    <section className={styles.details} aria-label="Featured artwork details">
      <div className={styles.position}>
        <svg
          className={styles.arrow}
          viewBox="0 0 64 32"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M60 19C44 14 28 12 4 16M21 5 4 16l18 11" />
        </svg>
        <p className={styles.counter}>
          <span className={styles.screenReaderOnly}>
            Artwork {position} of {total}
          </span>
          <span aria-hidden="true">
            {String(position).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </p>
        <svg
          className={styles.arrow}
          viewBox="0 0 64 32"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M4 19c16-5 32-7 56-3M43 5l17 11-18 11" />
        </svg>
      </div>

      <h2 className={styles.modelName}>{artwork.modelName}</h2>
      <ScoreBreakdown ratings={artwork.ratings} />
    </section>
  );
}
