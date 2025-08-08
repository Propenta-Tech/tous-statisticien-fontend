import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  // Configuration personnalisée pour TypeScript
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Règle pour 'any' - transformer l'erreur en warning
      "@typescript-eslint/no-explicit-any": "warn",
      
      // Variables non utilisées
      "@typescript-eslint/no-unused-vars": [
        "warn", 
        { 
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        }
      ],
      
      // Désactiver les règles trop strictes
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/prefer-const": "warn",
      "@typescript-eslint/no-inferrable-types": "warn",
      
      // Règles React
      "react-hooks/exhaustive-deps": "warn",
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
      
      // Règles générales
      "prefer-const": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn"
    }
  },
  
  // Ignorer certains fichiers
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "*.config.js",
      "*.config.mjs",
      "*.config.ts"
    ]
  }
];

export default eslintConfig;