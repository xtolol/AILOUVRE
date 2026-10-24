/* Owns the development experiment's sequential batch and temporary image lifecycle. */
"use client";

import { useEffect, useRef, useState } from "react";
import { decodePreviewImage, requestPreviewImage } from "../client/generation.js";
import GalleryCarousel from "./GalleryCarousel.jsx";
import styles from "../styles/GenerationGallery.module.css";

/**
 * Builds stable empty slots in configuration order without starting any requests.
 * @param {import("../contracts/generation.js").ImageModel[]} models The eligible image models.
 * @param {"idle"|"queued"} status The initial state for every slot.
 * @returns {import("../contracts/generation.js").GenerationSlot[]} The temporary model slots.
 */
function createSlots(models, status = "idle") {
  /**
   * Creates one empty slot retaining the configured model identity and display name.
   * @param {import("../contracts/generation.js").ImageModel} model An eligible model.
   * @returns {import("../contracts/generation.js").GenerationSlot} The model's initial slot.
   */
  function createSlot(model) {
    return {
      id: model.id,
      modelName: model.name,
      status,
      src: null,
      width: null,
      height: null,
      generation: null,
      error: null,
      ratings: null,
    };
  }
  return models.map(createSlot);
}

/**
 * Runs an explicitly triggered sequential experiment while preserving carousel selection.
 * @param {{ models: import("../contracts/generation.js").ImageModel[] }} props The server-selected eligible models in request order.
 * @returns {import("react").ReactElement} Generation controls and the live model-slot carousel.
 */
export default function GenerationGallery({ models }) {
  /**
   * Initializes the model slots once without performing generation during rendering.
   * @returns {import("../contracts/generation.js").GenerationSlot[]} Idle slots in model order.
   */
  function initializeSlots() {
    return createSlots(models);
  }

  const [slots, setSlots] = useState(initializeSlots);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState("No images generated yet.");
  const activeBatch = useRef(null);
  const imageUrls = useRef(new Set());

  /**
   * Registers cancellation and URL disposal without starting requests on mount.
   * @returns {() => void} The experiment's unmount cleanup.
   */
  function registerCleanup() {
    const urls = imageUrls.current;

    /**
     * Stops the active queue, aborts its request and releases all completed image URLs.
     * @returns {void} No value is returned.
     */
    function cleanUpExperiment() {
      const batch = activeBatch.current;
      activeBatch.current = null;
      batch?.abort();
      for (const src of urls) {
        URL.revokeObjectURL(src);
      }
      urls.clear();
    }
    return cleanUpExperiment;
  }
  useEffect(registerCleanup, []);

  /**
   * Replaces one slot's fields in place without changing the carousel's order or identity.
   * @param {string} modelId The stable model identifier.
   * @param {Partial<import("../contracts/generation.js").GenerationSlot>} patch The new state fields.
   * @returns {void} No value is returned.
   */
  function updateSlot(modelId, patch) {
    /**
     * Applies a model update to the most recent slot state.
     * @param {import("../contracts/generation.js").GenerationSlot[]} currentSlots The latest ordered slots.
     * @returns {import("../contracts/generation.js").GenerationSlot[]} The updated ordered slots.
     */
    function replaceSlot(currentSlots) {
      /**
       * Updates only the matching model while retaining every other slot object.
       * @param {import("../contracts/generation.js").GenerationSlot} slot An existing model slot.
       * @returns {import("../contracts/generation.js").GenerationSlot} The original or patched slot.
       */
      function applyPatch(slot) {
        return slot.id === modelId ? { ...slot, ...patch } : slot;
      }
      return currentSlots.map(applyPatch);
    }
    setSlots(replaceSlot);
  }

  /**
   * Generates one image per model sequentially with bounded retries for rate-limit failures.
   * @returns {Promise<void>} Resolves after all slots finish or the component unmounts.
   */
  async function handleGenerateAll() {
    if (activeBatch.current || models.length === 0) {
      return;
    }
    const batch = new AbortController();
    activeBatch.current = batch;
    setGenerating(true);
    for (const src of imageUrls.current) {
      URL.revokeObjectURL(src);
    }
    imageUrls.current.clear();
    setSlots(createSlots(models, "queued"));
    let readyCount = 0;
    let errorCount = 0;

    try {
      for (const model of models) {
        if (activeBatch.current !== batch || batch.signal.aborted) {
          return;
        }
        updateSlot(model.id, { status: "generating" });

        /**
         * Announces the active attempt or rate-limit wait without changing carousel selection.
         * @param {{ attempt: number, maxAttempts: number, waitMs: number }} progress The current request or upcoming retry.
         * @returns {void} No value is returned.
         */
        function reportAttempt({ attempt, maxAttempts, waitMs }) {
          if (activeBatch.current !== batch || batch.signal.aborted) {
            return;
          }
          const attemptLabel = `attempt ${attempt} of ${maxAttempts}`;
          setProgress(waitMs > 0
            ? `${model.name}: rate limited. Retrying in ${Math.ceil(waitMs / 1000)} seconds (${attemptLabel}).`
            : `Generating ${model.name} (${readyCount + errorCount + 1} of ${models.length}, ${attemptLabel}).`);
        }

        try {
          const { image, ...generation } = await requestPreviewImage(model.id, batch.signal, reportAttempt);
          const decoded = await decodePreviewImage(image, batch.signal);
          if (activeBatch.current !== batch || batch.signal.aborted) {
            URL.revokeObjectURL(decoded.src);
            return;
          }
          imageUrls.current.add(decoded.src);
          updateSlot(model.id, { ...decoded, generation, status: "ready", error: null });
          readyCount += 1;
        } catch (error) {
          if (activeBatch.current !== batch || batch.signal.aborted) {
            return;
          }
          updateSlot(model.id, {
            status: "error",
            error: error instanceof Error ? error.message : "Image generation could not be completed.",
          });
          errorCount += 1;
        }
      }
      setProgress(`Batch complete: ${readyCount} ready, ${errorCount} failed.`);
    } finally {
      if (activeBatch.current === batch) {
        activeBatch.current = null;
        setGenerating(false);
      }
    }
  }

  return (
    <>
      <section className={styles.controls} aria-label="Image generation experiment">
        <h2 className={styles.heading}>Ballerina image experiment</h2>
        <p className={styles.description}>
          Four models, one prompt, square format requested. Development preview. Results reset on refresh.
        </p>
        <button
          className={styles.generateButton}
          type="button"
          onClick={handleGenerateAll}
          disabled={generating || models.length === 0}
        >
          {generating ? "Generating images…" : "Generate four images"}
        </button>
        <p className={styles.progress} role="status" aria-atomic="true">{progress}</p>
      </section>
      <GalleryCarousel artworks={slots} initialArtworkId={models[0]?.id} />
    </>
  );
}
