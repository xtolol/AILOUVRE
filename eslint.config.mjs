/*
 * Applies Next.js lint rules to AILOUVRE and permits documented, unused
 * parameters in stub interfaces while continuing to check unused local values.
 */
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  {
    files: ["src/**/*.js", "src/**/*.jsx"],
    rules: {
      "no-unused-vars": ["error", { args: "none" }],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "node_modules/**"]),
]);
