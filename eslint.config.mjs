import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // One-off scripts — not linted
    "scripts/**",
  ]),
  {
    rules: {
      // Hydration guards (setMounted/setDelivery in useEffect) are the
      // standard React pattern for avoiding hydration mismatches.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
