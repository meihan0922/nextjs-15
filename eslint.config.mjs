import path from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const config = [
  {
    ignores: ["components/ui/**/*"],
  },
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "standard",
    // "plugin:tailwindcss/recommended",
    "prettier",
  ),
  {
    rules: {
      "import/order": [
        "error",
        {
          groups: [
            "type", // TS 的 import type
            "builtin", // Node "builtin" modules
            "external", // npm 模組
            "internal", // alias（@/ 或 ~ 這類內部別名）
            ["parent", "sibling", "index"], // 相對路徑
            "object", // import foo = require('foo')
          ],
          "newlines-between": "always", // 每個 group 間空一行
          pathGroups: [
            {
              pattern: "@app/**",
              group: "external",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "comma-dangle": "off",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "no-undef": "off",
    },
  },
];

export default config;
