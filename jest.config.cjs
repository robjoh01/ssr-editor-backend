module.exports = {
    testEnvironment: "node",
    preset: "@shelf/jest-mongodb",
    transform: {
        "^.+\\.jsx?$": "babel-jest",
    },
    setupFiles: ["<rootDir>/jest.setup.js"],
    moduleNameMapper: {
        "^@routes/(.*)$": "<rootDir>/src/routes/$1",
        "^@utils/(.*)$": "<rootDir>/src/utils/$1",
        "^@views/(.*)$": "<rootDir>/src/views/$1",
        "^@middlewares/(.*)$": "<rootDir>/src/middlewares/$1",
        "^@collections/(.*)$": "<rootDir>/src/collections/$1",
        "^@tests/(.*)$": "<rootDir>/src/tests/$1",
    },
    collectCoverage: true,
    coverageReporters: ["html", "text", "clover", "json-summary"],
    coverageDirectory: "coverage",
    collectCoverageFrom: [
        "src/routes/**/*.js",
        "!src/routes/**/auth/social/**/*.js",
        "!src/routes/**/auth/login/**/*.js",
        "!src/routes/[...catchall].js",
        "!src/routes/help.js",
        "!src/routes/index.js",
        "!src/routes/reset.js",
        "src/utils/**/*.js",
        "!src/utils/strategies/*.js",
        "!src/utils/database.js",
        "!src/utils/graphql/*.js",
        "!src/utils/token.js",
    ],
    coverageThreshold: {
        // FIXME: Fix this
        global: {
            statements: 50,
            branches: 40,
            functions: 50,
            lines: 50,
        },
    },
    testTimeout: 10000, // Set timeout for tests
}
