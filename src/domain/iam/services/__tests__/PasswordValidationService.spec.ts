/* eslint-disable sonarjs/no-duplicate-string */
import { PasswordValidationService } from "../PasswordValidationService";

describe("domain/iam/services/PasswordValidationService", () => {
  it("should be defined", () => {
    expect(typeof PasswordValidationService).toBe("function");
  });

  describe("validatePassword()", () => {
    it("should be defined", () => {
      const service = new PasswordValidationService();
      expect(typeof service.validatePassword).toBe("function");
    });

    it("should return false if password is less than N characters", () => {
      const service = new PasswordValidationService();
      expect(() => service.validatePassword("foobar")).toThrow();
      expect(() => service.validatePassword("foobars")).toThrow();
    });

    it("should return false if password does not contain any alphabet", () => {
      const service = new PasswordValidationService();
      expect(() => service.validatePassword("12345678")).toThrow();
    });

    it("should return false if password does not contain any number", () => {
      const service = new PasswordValidationService();
      expect(() => service.validatePassword("fooobaar")).toThrow();
    });

    it("should return false if password does not contain any non-alphanumeric", () => {
      const service = new PasswordValidationService();
      expect(() => service.validatePassword("fubar123")).toThrow();
    });

    it("should skip characters check if length is more than certain number", () => {
      const service = new PasswordValidationService();
      expect(() => service.validatePassword("suppassword")).toThrow();
      expect(() => service.validatePassword("superlongpassword")).not.toThrow();
    });

    it("should return true if passed all checks", () => {
      const service = new PasswordValidationService();
      expect(() =>
        service.validatePassword("supersecurepassword"),
      ).not.toThrow();
    });
  });
});
