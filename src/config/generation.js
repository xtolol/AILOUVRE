/*
 * Defines the shared settings and exact tester prompt for AILOUVRE's initial
 * ballerina generation preview. Importing these constants performs no requests.
 */

/** @type {import("../contracts/generation.js").ImageGenerationSettings} */
export const IMAGE_GENERATION_SETTINGS = {
  aspect_ratio: "1:1",
  n: 1,
  stream: false,
};

export const TEST_GENERATION_PROMPT =
  "A full body shot of a ballerina mid-leap. She is wearing a white tutu. Her expression is one of intense focus and grace. Her muscles should be defined, showing the physical exertion of the pose. Capture the fluidity and athleticisim of the stance while maintainiing realism in anatomy.";
