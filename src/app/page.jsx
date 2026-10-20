/*
 * Composes the static gallery preview from local presentation data.
 * All artwork, captions and rating values are frontend-only preview content.
 */
import ArtworkDetails from "../components/ArtworkDetails.jsx";
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
  /**
   * Locates the fixture whose model caption and ratings accompany the center frame.
   * @param {import("../data/demoGallery.js").DemoArtwork} artwork The preview entry to inspect.
   * @returns {boolean} Whether the entry matches the featured identifier.
   */
  function isFeaturedArtwork(artwork) {
    return artwork.id === demoFeaturedArtworkId;
  }

  const featuredIndex = demoArtworks.findIndex(isFeaturedArtwork);
  const featuredArtwork = demoArtworks[featuredIndex];

  return (
    <main className={styles.galleryPage}>
      <SiteHeader />
      <ExhibitionHeader exhibition={demoExhibition} />
      <GalleryGrid
        artworks={demoArtworks}
        featuredArtworkId={demoFeaturedArtworkId}
      />
      <ArtworkDetails
        artwork={featuredArtwork}
        position={featuredIndex + 1}
        total={demoArtworks.length}
      />
    </main>
  );
}
