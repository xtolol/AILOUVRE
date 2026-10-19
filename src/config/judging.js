/*
 * Names AILOUVRE's future judging dimensions and reserves its Jev model.
 * Rubrics, question wording, weights, and ranking rules are not implemented.
 */
export const JUDGE_MODEL = "typesafe/jev-1.14";

export const JUDGING_DIMENSIONS = [
  { id: "adherence", name: "Adherence" },
  { id: "technicalIntegrity", name: "Technical integrity" },
  { id: "aesthetics", name: "Aesthetics" },
  { id: "creativeInterpretation", name: "Perceived creative interpretation" },
];
