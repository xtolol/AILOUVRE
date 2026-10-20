/* Draws decorative, slightly irregular stars for the static rating preview. */
import styles from "../styles/RatingStars.module.css";

const STAR_POSITIONS = [1, 2, 3, 4, 5];

/**
 * Displays a labeled five-star graphic without voting or focusable controls.
 * @param {{ value: number, label: string }} props The filled star count and accessible graphic description.
 * @returns {import("react").ReactElement} The noninteractive star group.
 */
export default function RatingStars({ value, label }) {
  /**
   * Draws one outlined star and adds pencil-like strokes when it is filled.
   * @param {number} position The one-based position of the star in the row.
   * @returns {import("react").ReactElement} The decorative star SVG.
   */
  function renderStar(position) {
    const filled = position <= value;

    return (
      <svg
        className={styles.star}
        data-filled={filled}
        viewBox="0 0 26 28"
        aria-hidden="true"
        focusable="false"
        key={position}
      >
        <path d="m13 2 3.3 7.9 8.4.8-6.4 5.7 1.9 8.6-7.2-4.6-7.4 4.7 2-8.7-6.3-5.8 8.6-.7Z" />
        {filled && (
          <path
            className={styles.scribble}
            d="m10 10 5-2m-7 6 10-4M8 18l10-5m-7 6 6-3"
          />
        )}
      </svg>
    );
  }

  return (
    <span className={styles.stars} role="img" aria-label={label}>
      {STAR_POSITIONS.map(renderStar)}
    </span>
  );
}
