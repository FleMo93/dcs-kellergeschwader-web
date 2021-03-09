module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [
        "**src/**/*.js",
        "**src/**/*.ts",
        "!**/**/*.d.ts"
    ],
    coveragePathIgnorePatterns: [
        "/node_modules/"
    ],
    coverageDirectory: "reports",
    coverageReporters: [
        "text",
        "lcov"
    ],
    moduleFileExtensions: [
        "ts",
        "js"
    ],
    testRegex: "./tests/.*.(test|spec).ts$",
    reporters: [
        "default",
        "jest-junit"
    ],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
    roots: [
        "<rootDir>/src/", "<rootDir>/tests/"
    ],
    modulePaths: [
        "<rootDir>"
    ],
    setupFiles: []
}
