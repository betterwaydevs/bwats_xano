import pluginJs from "@eslint/js";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: { globals: globals.browser },
    plugins: {
      "simple-import-sort": simpleImportSort, 
      "unused-imports": unusedImports,
    },
    rules: {
      "simple-import-sort/imports": ["error",
        {
          "groups": [["^\\u0000", "^node:", "^@?\\w", "^", "^\\."]]
        }
      ],
      "unused-imports/no-unused-imports": "error",
    }
  },
  pluginJs.configs.recommended,
];