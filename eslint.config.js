const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  {
    ignores: ["node_modules/**", "database/**", ".moonlink/**"],
  },

  js.configs.recommended,

  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-console": "off",
      eqeqeq: "warn",
      "prefer-const": "warn",
      "no-var": "error",
    },
  },
];
