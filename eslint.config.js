import globals from "globals"
import pluginJs from "@eslint/js"

export default [
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        ignores: [
            "node_modules/**",
            "dist/**",
            "*.min.js",
            "**/*.test.js",
            "coverage/**",
        ],
        rules: {
            // No semi in the code
            semi: ["error", "never"],

            // No console logs in the code
            "no-console": "warn",

            // Enforce double quotes
            quotes: ["error", "double"],
        },
    },
    pluginJs.configs.recommended,
]
