/*
 * Presents display-only Jev and personal star ratings from the prototype.
 * These samples do not aggregate the server contract's judging dimensions.
 */
import RatingStars from "./RatingStars.jsx";
import styles from "../styles/ScoreBreakdown.module.css";

/**
 * Renders the two labeled sample rating rows and decorative Jev chevron.
 * @param {{ ratings: import("../data/demoGallery.js").DemoRatings }} props The fixed preview values; no scores are computed or saved.
 * @returns {import("react").ReactElement} The static rating description list.
 */
export default function ScoreBreakdown({ ratings }) {
  return (
    <dl className={styles.ratings}>
      <div className={styles.row}>
        <dt className={styles.label}>Jev&apos;s rating</dt>
        <dd className={styles.value}>
          <RatingStars
            value={ratings.jev}
            label={`Sample Jev rating: ${ratings.jev} out of 5 stars`}
          />
          <svg
            className={styles.chevron}
            viewBox="0 0 24 16"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <path d="m3 4 9 9 9-10" />
          </svg>
        </dd>
      </div>
      <div className={styles.row}>
        <dt className={styles.label}>Your rating</dt>
        <dd className={styles.value}>
          <RatingStars
            value={ratings.personal}
            label={
              ratings.personal === 0
                ? "No personal rating"
                : `Sample personal rating: ${ratings.personal} out of 5 stars`
            }
          />
        </dd>
      </div>
    </dl>
  );
}
