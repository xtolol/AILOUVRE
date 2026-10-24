/*
 * Composes the server gallery shell with an explicit development generation
 * experiment or the local botanical carousel in production.
 */
import ExhibitionHeader from "../components/ExhibitionHeader.jsx";
import GalleryCarousel from "../components/GalleryCarousel.jsx";
import GenerationGallery from "../components/GenerationGallery.jsx";
import SiteHeader from "../components/SiteHeader.jsx";
import { IMAGE_MODELS } from "../config/models.js";
import {
  demoArtworks,
  demoExhibition,
  demoFeaturedArtworkId,
} from "../data/demoGallery.js";
import styles from "../styles/GalleryPage.module.css";

/**
 * Renders the server exhibition shell and selects the gallery appropriate to the environment.
 * @param {{ searchParams: Promise<Record<string, string|string[]|undefined>> }} props The framework page props; query parameters are unused.
 * @returns {import("react").ReactElement} The frontend homepage preview.
 */
export default function HomePage({ searchParams }) {
  /**
   * Selects models eligible for the initial OpenRouter Image API experiment.
   * @param {import("../contracts/generation.js").ImageModel} model A configured image model.
   * @returns {boolean} Whether the model should receive a development gallery slot.
   */
  function isPreviewEnabled(model) {
    return model.imageApiEnabled;
  }

  return (
    <main className={styles.galleryPage}>
      <SiteHeader />
      <ExhibitionHeader exhibition={demoExhibition} />
      {process.env.NODE_ENV === "development" ? (
        <GenerationGallery models={IMAGE_MODELS.filter(isPreviewEnabled)} />
      ) : (
        <GalleryCarousel
          artworks={demoArtworks}
          initialArtworkId={demoFeaturedArtworkId}
        />
      )}
    </main>
  );
}
