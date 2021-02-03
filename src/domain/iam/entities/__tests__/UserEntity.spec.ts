/* eslint-disable sonarjs/no-duplicate-string */
import { UserEntity } from "../UserEntity";

describe("domain/iam/entities/UserEntity", () => {
  it("should be defined", () => {
    expect(typeof UserEntity).toBe("function");
  });

  describe("validateWriteModel()", () => {
    it("should be defined", () => {
      const user = new UserEntity();
      expect(typeof user.validateWriteModel).toBe("function");
    });

    it("should throw if email is empty", () => {
      const user1 = new UserEntity();
      const user2 = new UserEntity();
      user2.email = "";
      expect(() => user1.validateWriteModel()).toThrow();
      expect(() => user2.validateWriteModel()).toThrow();
    });

    it("should throw if email does not have '@' sign", () => {
      const user = new UserEntity();
      user.email = "something";
      expect(() => user.validateWriteModel()).toThrow();
    });

    it("should not throw if email is filled correctly", () => {
      const user = new UserEntity();
      user.email = "some@thing";
      expect(() => user.validateWriteModel()).not.toThrow();
    });

    it("should validate password when flagged", () => {
      const user = new UserEntity();
      user.email = "some@thing";
      expect(() => user.validateWriteModel(true)).toThrow();
      user.password = "";
      expect(() => user.validateWriteModel(true)).toThrow();
      user.password = "something";
      expect(() => user.validateWriteModel(true)).not.toThrow();
    });
  });
});
