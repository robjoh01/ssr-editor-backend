module.exports = {
    testEnvironment: "node",
    preset: "@shelf/jest-mongodb",
    transform: {
        "^.+\\.jsx?$": "babel-jest",
    },
    moduleNameMapper: {
        "^@utils/(.*)$": "<rootDir>/src/utils/$1",
        "^@collections/(.*)$": "<rootDir>/src/collections/$1",
        "^@routes/(.*)$": "<rootDir>/routes/$1",
    },
    collectCoverage: true,
    coverageReporters: ["html", "text", "clover", "json-summary"],
    coverageDirectory: "coverage",
    collectCoverageFrom: [
        "routes/**/*.js",
        "src/utils/**/*.js",
        "!**/index.js",
        "!src/utils/strategies/*.js",
        "!src/utils/database.js",
    ],
    // coverageThreshold: {
    //     global: {
    //         statements: 80,
    //         branches: 80,
    //         functions: 80,
    //         lines: 80,
    //     },
    // },
    testTimeout: 10000, // Set timeout for tests
}
