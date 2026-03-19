import nextCoreWebVitals from "eslint-config-next/core-web-vitals"

const eslintConfig = [
  ...nextCoreWebVitals,
  {
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{
          group: ["three", "three/*", "@react-three/*"],
          message: "Three.js imports must be in client-only files (components/3d/) loaded via dynamic()",
        }],
      }],
    },
  },
  {
    files: ["components/3d/**/*.tsx", "components/3d/**/*.ts", "**/*.client.tsx"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
]

export default eslintConfig
