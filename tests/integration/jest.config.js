/* eslint-disable @typescript-eslint/no-var-requires */
const baseConfig = require("../../jest.config");

module.exports = {
  ...baseConfig,
  coverageDirectory: "<rootDir>/coverage/integration",
  testMatch: ["<rootDir>/tests/integration/**/*.integration.spec.ts"],
};
