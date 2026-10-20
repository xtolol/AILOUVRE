/*
 * Presents AILOUVRE's collage logo above the daily gallery.
 */
import Image from "next/image";
import styles from "../styles/SiteHeader.module.css";

/**
 * Renders the gallery identity using the existing local logo.
 * @param {{ title?: string }} props The accessible name of the gallery.
 * @returns {import("react").ReactElement} The site header and logo heading.
 */
export default function SiteHeader({ title = "AILOUVRE" }) {
  return (
    <header className={styles.siteHeader}>
      <h1 className={styles.heading}>
        <Image
          className={styles.logo}
          src="/logo.png"
          alt={title}
          width={954}
          height={152}
          sizes="(max-width: 600px) 230px, 266px"
          preload
        />
      </h1>
    </header>
  );
}
