/*
 * Presents illustrative demo ratings or an explicit unjudged generation state.
 * Demo samples do not aggregate the server contract's judging dimensions.
 */
import RatingStars from "./RatingStars.jsx";
import styles from "../styles/ScoreBreakdown.module.css";

/**
 * Renders the sample rating rows or labels previews that have no real judgment.
 * @param {{ ratings: import("../data/demoGallery.js").DemoRatings|null }} props Fixed demo values or null for an unjudged generation slot.
 * @returns {import("react").ReactElement} The static rating description list.
 */
export default function ScoreBreakdown({ ratings }) {
  if (!ratings) {
    return <p className={styles.unjudged}>Not yet judged</p>;
  }

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
