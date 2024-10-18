import globals from "globals"
import pluginJs from "@eslint/js"

export default [
    {
        files: ["**/*.{js,mjs,cjs}"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            // No semi in the code
            semi: ["error", "never"],

            // Ignore console logs
            "no-console": "off",

            // Enforce double quotes
            quotes: ["error", "double"],
        },
    },
    pluginJs.configs.recommended,
    {
        ignores: [
            "node_modules/**/*",
            "dist/**/*",
            "build/**/*",
            "*.chunk.js",
            "*.min.js",
            "**/*.test.{js,mjs,cjs}",
            "coverage/**/*",
        ],
    },
]
