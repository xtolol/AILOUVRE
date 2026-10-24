/* Owns local artwork selection and the looping carousel's navigation lifecycle. */
"use client";

import { useEffect, useId, useRef, useState } from "react";
import ArtworkDetails from "./ArtworkDetails.jsx";
import GalleryGrid from "./GalleryGrid.jsx";
import styles from "../styles/GalleryCarousel.module.css";

const TRANSITION_DURATION_MS = 450;

/**
 * Coordinates the animated artwork strip, accessible arrows and selected details.
 * @param {{ artworks: Array<import("../data/demoGallery.js").DemoArtwork|import("../contracts/generation.js").GenerationSlot>, initialArtworkId?: string }} props The demo entries or generation slots and initially selected identifier.
 * @returns {import("react").ReactElement} The interactive frontend carousel or its empty state.
 */
export default function GalleryCarousel({ artworks, initialArtworkId }) {
  /**
   * Finds the entry selected when the carousel first mounts.
   * @param {import("../data/demoGallery.js").DemoArtwork|import("../contracts/generation.js").GenerationSlot} artwork The entry to inspect.
   * @returns {boolean} Whether the artwork matches the initial identifier.
   */
  function isInitialArtwork(artwork) {
    return artwork.id === initialArtworkId;
  }

  const initialIndex = Math.max(0, artworks.findIndex(isInitialArtwork));
  const [cursor, setCursor] = useState(initialIndex);
  const [transitioning, setTransitioning] = useState(false);
  const transitionLocked = useRef(false);
  const animationTimer = useRef(null);
  const galleryId = useId();
  const count = artworks.length;
  const selectedIndex = count > 0 ? ((cursor % count) + count) % count : 0;

  /**
   * Registers cleanup so a pending navigation timer cannot outlive the carousel.
   * @returns {() => void} The animation timer cleanup function.
   */
  function registerCleanup() {
    /**
     * Cancels a pending transition lock when the carousel unmounts.
     * @returns {void} No value is returned.
     */
    function clearAnimationTimer() {
      window.clearTimeout(animationTimer.current);
      transitionLocked.current = false;
    }

    return clearAnimationTimer;
  }

  useEffect(registerCleanup, []);

  /**
   * Restores navigation after the CSS movement duration has elapsed.
   * @returns {void} No value is returned.
   */
  function finishTransition() {
    transitionLocked.current = false;
    animationTimer.current = null;
    setTransitioning(false);
  }

  /**
   * Advances one virtual position while keeping the circular artwork order stable.
   * @param {-1|1} direction The previous or next traversal direction.
   * @returns {void} No value is returned.
   */
  function moveArtwork(direction) {
    if (count < 2 || transitionLocked.current) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!reducedMotion) {
      transitionLocked.current = true;
      setTransitioning(true);
      animationTimer.current = window.setTimeout(
        finishTransition,
        TRANSITION_DURATION_MS,
      );
    }

    /**
     * Moves the cursor without depending on a possibly batched prior render.
     * @param {number} currentCursor The latest virtual artwork position.
     * @returns {number} The requested adjacent virtual position.
     */
    function advanceCursor(currentCursor) {
      return currentCursor + direction;
    }

    setCursor(advanceCursor);
  }

  /**
   * Selects the previous artwork, wrapping through the beginning of the list.
   * @returns {void} No value is returned.
   */
  function showPreviousArtwork() {
    moveArtwork(-1);
  }

  /**
   * Selects the next artwork, wrapping through the end of the list.
   * @returns {void} No value is returned.
   */
  function showNextArtwork() {
    moveArtwork(1);
  }

  /**
   * Handles horizontal arrow keys only while keyboard focus is inside the carousel.
   * @param {import("react").KeyboardEvent<HTMLElement>} event The bubbled keyboard event.
   * @returns {void} No value is returned.
   */
  function handleKeyDown(event) {
    if (
      count < 2 ||
      event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      (event.key !== "ArrowLeft" && event.key !== "ArrowRight")
    ) {
      return;
    }

    event.preventDefault();
    moveArtwork(event.key === "ArrowLeft" ? -1 : 1);
  }

  return (
    <section
      className={styles.carousel}
      aria-label="Artwork carousel"
      aria-roledescription="carousel"
      onKeyDown={handleKeyDown}
    >
      {count === 0 ? (
        <p className={styles.empty}>No artwork to display.</p>
      ) : (
        <>
          <GalleryGrid artworks={artworks} cursor={cursor} id={galleryId} />
          <ArtworkDetails
            artwork={artworks[selectedIndex]}
            position={selectedIndex + 1}
            total={count}
            onPrevious={showPreviousArtwork}
            onNext={showNextArtwork}
            transitioning={transitioning}
            galleryId={galleryId}
          />
        </>
      )}
    </section>
  );
}
