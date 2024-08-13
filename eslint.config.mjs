import pluginJs from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import eslintReact from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import tsEslint from "typescript-eslint";
import globals from "globals";

export default tsEslint.config(
  {
    ignores: ["front/build", ".prettierrc.js", "api/jest.config.js"],
  },
  {
    files: ["**/webpack.config.js"],
    languageOptions: { globals: globals.node },
  },
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    plugins: {
      react: eslintReact,
      "react-hooks": hooksPlugin,
    },
    rules: {
      ...hooksPlugin.configs.recommended.rules,
      ...eslintReact.configs.recommended.rules,
      ...eslintReact.configs["jsx-runtime"].rules,
    },
    settings: { react: { version: "detect" } },
  },
  jsxA11y.flatConfigs.recommended,
);
