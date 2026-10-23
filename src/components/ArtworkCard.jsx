/*
 * Presents a local preview image in a white artwork frame with fading tape.
 */
import Image from "next/image";
import styles from "../styles/ArtworkCard.module.css";

/**
 * Frames one sample artwork and decorates the featured image with paper tape.
 * @param {{ artwork: import("../data/demoGallery.js").DemoArtwork, featured?: boolean }} props The preview image and its featured state.
 * @returns {import("react").ReactElement} The framed artwork image.
 */
export default function ArtworkCard({ artwork, featured = false }) {
  return (
    <figure className={styles.frame} data-featured={featured}>
      <Image
        className={styles.image}
        src={artwork.src}
        alt={artwork.alt}
        width={artwork.width}
        height={artwork.height}
        sizes="(max-width: 526px) 76vw, 400px"
        preload={featured}
        loading={featured ? undefined : "eager"}
      />
      <span className={styles.tape} aria-hidden="true" />
    </figure>
  );
}
