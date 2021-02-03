/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const { pathsToModuleNameMapper } = require("ts-jest/utils");

const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  clearMocks: true,
  coverageDirectory: "<rootDir>/coverage/unit",
  moduleFileExtensions: ["js", "json", "ts"],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/" }),
  },
  rootDir: path.resolve(__dirname, "."),
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/__tests__/*.spec.ts"],
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  verbose: true,
};
