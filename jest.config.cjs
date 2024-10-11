module.exports = {
    testEnvironment: "node",
    transform: {
        "^.+\\.jsx?$": "babel-jest",
    },
    collectCoverage: true,
    coverageReporters: ["html", "text", "clover", "json-summary"],
    coverageDirectory: "coverage",
    collectCoverageFrom: [
        "src/collections/**/*.js",
        "src/models/**/*.js",
        //"src/utils/**/*.js",
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
