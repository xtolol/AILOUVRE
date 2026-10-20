/*
 * Keeps static frontend preview content separate from future server contracts.
 * These values describe the supplied prototype, not a live daily exhibition.
 */

/**
 * Presentation-only metadata for the static main gallery preview.
 * @typedef {Object} DemoExhibition
 * @property {string} number The exhibition number, including leading zeroes.
 * @property {string} date The fixed ISO date shown by the prototype.
 * @property {string} dateLabel The human-readable exhibition date.
 * @property {string} theme The exhibition theme displayed in the header.
 */

/** @type {DemoExhibition} */
export const demoExhibition = {
  number: "001",
  date: "2026-10-19",
  dateLabel: "19 October 2026",
  theme: "Botanical Dreams",
};

/**
 * A replaceable local photo used to preview the artwork frame layout.
 * @typedef {Object} DemoArtwork
 * @property {string} id The unique presentation entry identifier.
 * @property {string} src The locally bundled image path.
 * @property {string} alt A description of the image content.
 * @property {number} width The source image width in pixels.
 * @property {number} height The source image height in pixels.
 */

/** @type {DemoArtwork[]} */
export const demoArtworks = [
  {
    id: "foliage-01",
    src: "/artworks/botanical-foliage.jpg",
    alt: "Overlapping green leaves against a dark botanical background",
    width: 900,
    height: 900,
  },
  {
    id: "blossoms-02",
    src: "/artworks/botanical-blossoms.jpg",
    alt: "Golden California poppies against a turquoise blue sky",
    width: 900,
    height: 900,
  },
  {
    id: "lavender-03",
    src: "/artworks/lavender-field.jpg",
    alt: "Rows of purple lavender beneath a warm sunset sky",
    width: 1000,
    height: 1000,
  },
  {
    id: "foliage-04",
    src: "/artworks/botanical-foliage.jpg",
    alt: "Overlapping green leaves against a dark botanical background",
    width: 900,
    height: 900,
  },
  {
    id: "blossoms-05",
    src: "/artworks/botanical-blossoms.jpg",
    alt: "Golden California poppies against a turquoise blue sky",
    width: 900,
    height: 900,
  },
];

export const demoFeaturedArtworkId = "lavender-03";
