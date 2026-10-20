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
