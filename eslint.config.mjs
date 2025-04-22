import globals from "globals";
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier/flat";

const base = tseslint.config(
  js.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...base,
  {
    ignores: [".next/*", ".yarn/*", ".pnp.cjs", "public/**"],
  },
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  reactPlugin.configs.flat.all,
  reactPlugin.configs.flat["jsx-runtime"],
  {
    rules: {
      "react/forbid-component-props": 0,
      "react/function-component-definition": [
        2,
        { namedComponents: "arrow-function" },
      ],
      "react/jsx-filename-extension": [1, { extensions: [".tsx"] }],
      "react/jsx-max-depth": 0,
      "react/jsx-no-literals": 0,
      "react/jsx-props-no-spreading": 0,
      "react/no-multi-comp": 0,
      "react/require-default-props": 0,
      "react/no-unknown-property": [2, { ignore: ["tw"] }],
    },
  },
  {
    files: ["**/*.tsx"],
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  nextPlugin.flatConfig.recommended, // eslint-disable-line @typescript-eslint/no-unsafe-member-access
  nextPlugin.flatConfig.coreWebVitals, // eslint-disable-line @typescript-eslint/no-unsafe-member-access
  prettier,
];
