/* eslint-disable @typescript-eslint/no-var-requires */
const baseConfig = require("../../jest.config");

module.exports = {
  ...baseConfig,
  coverageDirectory: "<rootDir>/coverage/e2e",
  testMatch: ["<rootDir>/tests/e2e/**/*.e2e.spec.ts"],
};
