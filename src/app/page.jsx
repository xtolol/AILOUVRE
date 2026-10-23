/*
 * Composes the gallery shell and local interactive artwork carousel.
 * All artwork, captions and rating values are frontend-only preview content.
 */
import ExhibitionHeader from "../components/ExhibitionHeader.jsx";
import GalleryCarousel from "../components/GalleryCarousel.jsx";
import SiteHeader from "../components/SiteHeader.jsx";
import {
  demoArtworks,
  demoExhibition,
  demoFeaturedArtworkId,
} from "../data/demoGallery.js";
import styles from "../styles/GalleryPage.module.css";

/**
 * Renders the server-side exhibition shell around the client-side sample carousel.
 * @param {{ searchParams: Promise<Record<string, string|string[]|undefined>> }} props The framework page props; query parameters are unused.
 * @returns {import("react").ReactElement} The frontend homepage preview.
 */
export default function HomePage({ searchParams }) {
  return (
    <main className={styles.galleryPage}>
      <SiteHeader />
      <ExhibitionHeader exhibition={demoExhibition} />
      <GalleryCarousel
        artworks={demoArtworks}
        initialArtworkId={demoFeaturedArtworkId}
      />
    </main>
  );
}
