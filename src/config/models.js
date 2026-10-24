/*
 * Records AILOUVRE's five selected image models and their eligibility for
 * the initial OpenRouter Image API experiment. Listing a model does not invoke it.
 */

/** @type {import("../contracts/generation.js").ImageModel[]} */
export const IMAGE_MODELS = [
  {
    id: "openai/gpt-image-2.5-sunburst",
    name: "GPT Image 2.5 Sunburst",
    imageApiEnabled: true,
  },
  {
    id: "bytedance-seed/seedream-4.5",
    name: "Seedream 4.5",
    imageApiEnabled: true,
  },
  {
    id: "x-ai/grok-imagine-image-2.0",
    name: "Grok Imagine Image 2.0",
    imageApiEnabled: true,
  },
  {
    id: "meta/muse-image",
    name: "Muse Image",
    imageApiEnabled: false,
  },
  {
    id: "black-forest-labs/flux.2-klein-4b",
    name: "FLUX.2 Klein 4B",
    imageApiEnabled: true,
  },
];
