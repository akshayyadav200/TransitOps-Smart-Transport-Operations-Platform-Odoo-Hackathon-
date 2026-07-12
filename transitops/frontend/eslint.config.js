export default [
  {
    ignores: ["node_modules/**", "dist/**"]
  },
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        document: "readonly",
        window: "readonly",
        fetch: "readonly",
        URL: "readonly",
        import: "readonly"
      }
    },
    rules: {
      "no-unused-vars": ["error", { "varsIgnorePattern": "^[A-Z_]" }],
      "no-undef": "error",
      "no-var": "error",
      "prefer-const": "error"
    }
  }
];
