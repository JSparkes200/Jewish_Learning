/**
 * Repo-root legacy PWA (`sw.js`). Next app ESLint lives in `web/eslint.config.mjs`.
 * Run: `cd web && npx eslint -c ../eslint.config.mjs ../sw.js`
 */
export default [
  {
    files: ["sw.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        caches: "readonly",
        clients: "readonly",
        self: "readonly",
      },
    },
  },
];
