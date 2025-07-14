import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

// export default tseslint.config([
//   globalIgnores(['dist']),
//   {
//     files: ['**/*.{ts,tsx}'],
//     extends: [
//       // Other configs...

//       // Remove tseslint.configs.recommended and replace with this
//       ...tseslint.configs.recommendedTypeChecked,
//       // Alternatively, use this for stricter rules
//       ...tseslint.configs.strictTypeChecked,
//       // Optionally, add this for stylistic rules
//       ...tseslint.configs.stylisticTypeChecked,

//       // Other configs...
//     ],
//     languageOptions: {
//       parserOptions: {
//         project: ['./tsconfig.node.json', './tsconfig.app.json'],
//         tsconfigRootDir: import.meta.dirname,
//       },
//       // other options...
//     },

//     rules: {
//       "@typescript-eslint/no-explicit-any": "error"
//     }
//   },
// ])

// // eslint.config.js
// import reactX from 'eslint-plugin-react-x'
// import reactDom from 'eslint-plugin-react-dom'

// export default tseslint.config([
//   globalIgnores(['dist']),
//   {
//     files: ['**/*.{ts,tsx}'],
//     extends: [
//       // Other configs...
//       // Enable lint rules for React
//       reactX.configs['recommended-typescript'],
//       // Enable lint rules for React DOM
//       reactDom.configs.recommended,
//     ],
//     languageOptions: {
//       parserOptions: {
//         project: ['./tsconfig.node.json', './tsconfig.app.json'],
//         tsconfigRootDir: import.meta.dirname,
//       },
//       // other options...
//     },
//   },
// ])

// @ts-check
import js from "@eslint/js";
import reactDom from "eslint-plugin-react-dom";
import tseslint from "typescript-eslint";

export default tseslint.config({
  files: ["**/*.ts", "**/*.tsx"],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    reactDom.configs.recommended,
  ],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    // Put rules you want to override here
    "react-dom/no-dangerously-set-innerhtml": "warn",
  },
});