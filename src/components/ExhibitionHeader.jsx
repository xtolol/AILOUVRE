/*
 * Presents the static exhibition identity, date and decorative theme label.
 */
import styles from "../styles/ExhibitionHeader.module.css";

/**
 * Renders the exhibition metadata without implying an interactive theme menu.
 * @param {{ exhibition: import("../data/demoGallery.js").DemoExhibition }} props The local exhibition presentation data.
 * @returns {import("react").ReactElement} The exhibition information row.
 */
export default function ExhibitionHeader({ exhibition }) {
  return (
    <section
      className={styles.exhibitionHeader}
      aria-label="Exhibition information"
    >
      <p className={styles.identity}>
        <span>Exhibition {exhibition.number}</span>
        <time className={styles.date} dateTime={exhibition.date}>
          {exhibition.dateLabel}
        </time>
      </p>

      <p className={styles.theme}>
        <span>{exhibition.theme}</span>
        <svg
          className={styles.chevron}
          viewBox="0 0 24 16"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m2 3 10 9L22 2" />
        </svg>
      </p>
    </section>
  );
}
