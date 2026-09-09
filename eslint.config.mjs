import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  globalIgnores([".next/**", "data/telemetry-150k.jsonl.gz"]),
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "jsx-a11y/anchor-is-valid": "off",
    },
  },
]);
