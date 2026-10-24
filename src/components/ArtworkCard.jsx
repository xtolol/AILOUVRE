/*
 * Presents a demo or generated image, or a generation placeholder, in a stable frame.
 */
import Image from "next/image";
import { GENERATION_STATUS_LABELS } from "../client/generation.js";
import styles from "../styles/ArtworkCard.module.css";

/**
 * Frames one artwork or status placeholder and decorates the selected frame with tape.
 * @param {{ artwork: import("../data/demoGallery.js").DemoArtwork|import("../contracts/generation.js").GenerationSlot, featured?: boolean }} props The demo entry or generation slot and its featured state.
 * @returns {import("react").ReactElement} The framed artwork image.
 */
export default function ArtworkCard({ artwork, featured = false }) {
  const isGenerationSlot = Boolean(artwork.status);
  const hasImage = artwork.src && (!isGenerationSlot || artwork.status === "ready");

  return (
    <figure className={styles.frame} data-featured={featured} data-preview={isGenerationSlot}>
      {hasImage ? (
        <Image
          className={styles.image}
          src={artwork.src}
          alt={artwork.alt ?? `Generated ballerina study by ${artwork.modelName}`}
          width={artwork.width}
          height={artwork.height}
          sizes="(max-width: 526px) 76vw, 400px"
          unoptimized={isGenerationSlot}
          preload={featured && !isGenerationSlot}
          loading={featured && !isGenerationSlot ? undefined : "eager"}
        />
      ) : (
        <div className={styles.placeholder} data-error={artwork.status === "error"}>
          <strong className={styles.statusTitle}>{GENERATION_STATUS_LABELS[artwork.status]}</strong>
          <span>
            {artwork.error ?? (artwork.status === "idle"
              ? "Choose Generate four images to begin."
              : "Waiting for this model’s image.")}
          </span>
        </div>
      )}
      <span className={styles.tape} aria-hidden="true" />
    </figure>
  );
}
