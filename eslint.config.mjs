import globals from "globals";
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import { defineConfig } from "eslint/config";
import reactPlugin from "eslint-plugin-react";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier/flat";
import { fixupConfigRules } from "@eslint/compat";

const config = defineConfig(
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: [
      ".next/*",
      ".yarn/*",
      ".pnp.*",
      "public/**",
      "out",
      "next-env.d.ts",
      "*.mjs",
      "lib/lexicons",
    ],
  },
  {
    files: ["cloudfront/**/*.js"],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  {
    settings: {
      react: {
        version: "19",
      },
    },
  },
  // TODO: remove fixup
  // https://github.com/jsx-eslint/eslint-plugin-react/issues/3977
  // https://github.com/jsx-eslint/eslint-plugin-react/pull/3979
  fixupConfigRules([
    reactPlugin.configs.flat.all,
    reactPlugin.configs.flat["jsx-runtime"],
  ]),
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
  prettier,
);

export default config;
