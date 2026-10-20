/*
 * Composes the static gallery preview from local presentation data.
 * The first review checkpoint includes the site and exhibition headers.
 */
import ExhibitionHeader from "../components/ExhibitionHeader.jsx";
import SiteHeader from "../components/SiteHeader.jsx";
import { demoExhibition } from "../data/demoGallery.js";
import styles from "../styles/GalleryPage.module.css";

/**
 * Renders the main exhibition shell without fetching or generating artwork.
 * @param {{ searchParams: Promise<Record<string, string|string[]|undefined>> }} props The framework page props; query parameters are unused.
 * @returns {import("react").ReactElement} The static homepage preview.
 */
export default function HomePage({ searchParams }) {
  return (
    <main className={styles.galleryPage}>
      <SiteHeader />
      <ExhibitionHeader exhibition={demoExhibition} />
    </main>
  );
}
