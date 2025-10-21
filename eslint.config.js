import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import pluginDestructuringNewline from "eslint-plugin-destructuring-newline";
import pluginImportNewlines from "eslint-plugin-import-newlines";
import { importX } from "eslint-plugin-import-x";
import perfectionist from "eslint-plugin-perfectionist";
import { defineConfig } from "eslint/config";
import globals from "globals";
import { resolve } from "path";
import tseslint from "typescript-eslint";

export default defineConfig(
  { ignores: ["dist", ".legacy", "app/main/dev-dist", "reports"] },

  // javascript
  js.configs.recommended,
  { rules: {
    "no-console": ["warn", { allow: ["warn", "error", "info"] }],
    "no-control-regex": "off",
    "prefer-destructuring": ["error", {
      // typescript does not correctly destruct arrays. when we do [first] = array, it does not account for the possibility of the array been empty
      "array": false,
      "object": true
    }],
  } },

  // typescript
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  { rules: {
    "@typescript-eslint/consistent-indexed-object-style": "off",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        disallowTypeAnnotations: true,
        fixStyle: "inline-type-imports",
        prefer: "type-imports",
      },
    ],
    "@typescript-eslint/no-extraneous-class": [
      "error",
      {
        allowConstructorOnly: false,
        allowEmpty: false,
        allowStaticOnly: true,
        allowWithDecorator: false,
      }
    ],
    "@typescript-eslint/no-unsafe-call": "off"
  } },

  //style linters
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  { rules: {
    "import-x/consistent-type-specifier-style": ["error", "prefer-top-level"],
    "import-x/first": ["error", "absolute-first"],
    "import-x/newline-after-import": "error",
    "import-x/no-dynamic-require": "error",
    "import-x/no-named-as-default": "off",
    "import-x/no-nodejs-modules": "off"
  } },

  {
    plugins: { "@stylistic": stylistic },
    rules: {
      "@stylistic/comma-spacing": ["error", {
        "after": true,
        "before": false
      }],
      "@stylistic/indent": ["error", 2],
      "@stylistic/key-spacing": "error",
      "@stylistic/keyword-spacing": "error",
      "@stylistic/lines-between-class-members": [
        "error",
        { enforce: [
          {
            blankLine: "always",
            next: "method",
            prev: "*"
          }
        ], },
        {
          exceptAfterOverload: true,
          exceptAfterSingleLine: true
        },
      ],
      "@stylistic/multiline-ternary": ["error", "always-multiline"],
      "@stylistic/no-multi-spaces": "error",
      "@stylistic/no-multiple-empty-lines": ["error", {
        "max": 1,
        "maxBOF": 0,
        "maxEOF": 0
      }],
      "@stylistic/no-trailing-spaces": "error",
      "@stylistic/object-curly-newline": [
        "error",
        { minProperties: 2 },
      ],
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/object-property-newline": "error",
      "@stylistic/operator-linebreak": ["error", "before"],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/space-infix-ops": "error",
      "@stylistic/type-generic-spacing": ["error"]
    }
  },

  {
    plugins: { "import-newlines": pluginImportNewlines },
    rules: { "import-newlines/enforce": [
      "error",
      { items: 1, }
    ] }
  },

  {
    plugins: { "destructuring-newline": pluginDestructuringNewline },
    rules: { "destructuring-newline/object-property-newline": "error" }
  },

  perfectionist.configs["recommended-natural"],
  { rules: {
    "perfectionist/sort-classes": "off",
    "perfectionist/sort-interfaces": "off",
    "perfectionist/sort-modules": "off",
  } },

  // language settings
  {
    // this line tells eslint to link the typescript service with all file types used by the project
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: {
        parser: "@typescript-eslint/parser",
        project: [resolve(import.meta.dirname, "./tsconfig.json")],
        projectService: true,
        sourceType: "module",
        tsconfigRootDir: resolve(import.meta.dirname)
      }
    },
  },

  // only for config files
  {
    files: [
      "summary/**/*.{ts,js}",
      "*.{config,setup,shared}.{ts,js,mts,mjs,cts,cjs}",
    ],
    ignores: ["app/**", "e2e/**"],

    languageOptions: {
      globals: { ...globals.node },
      parser: tseslint.parser,
      parserOptions: {
        project: [resolve(import.meta.dirname, "./tsconfig.configs.json")],
        projectService: true,
        sourceType: "module",
        tsconfigRootDir: resolve(import.meta.dirname),
      },
    },
    rules: {
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "import-x/no-named-as-default-member": "off",
      "import-x/no-nodejs-modules": "off",
    },
  },
);
