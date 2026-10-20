/*
 * Composes the static gallery preview from local presentation data.
 * The second review checkpoint adds the framed artwork composition.
 */
import ExhibitionHeader from "../components/ExhibitionHeader.jsx";
import GalleryGrid from "../components/GalleryGrid.jsx";
import SiteHeader from "../components/SiteHeader.jsx";
import {
  demoArtworks,
  demoExhibition,
  demoFeaturedArtworkId,
} from "../data/demoGallery.js";
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
      <GalleryGrid
        artworks={demoArtworks}
        featuredArtworkId={demoFeaturedArtworkId}
      />
    </main>
  );
}
