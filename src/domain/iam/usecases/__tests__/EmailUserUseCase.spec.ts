/* eslint-disable sonarjs/no-duplicate-string */
import { mock } from "jest-mock-extended";

import { PasswordHashing, ValidateUserPassword } from "../../contracts";
import { UserRepository } from "../../repositories";
import { EmailUserUseCase } from "../EmailUserUseCase";

describe("domain/iam/usecases/EmailUserUseCase", () => {
  it("should be defined", () => {
    expect(typeof EmailUserUseCase).toBe("function");
  });

  describe("addNewUser()", () => {
    it("should be defined", () => {
      const userRepo = mock<UserRepository>();
      const specService = mock<ValidateUserPassword>();
      const hashService = mock<PasswordHashing>();
      const useCase = new EmailUserUseCase(userRepo, specService, hashService);
      expect(typeof useCase.addNewUser).toBe("function");
    });

    it("should validate the password to match rule", async () => {
      const userRepo = mock<UserRepository>();
      const specService = mock<ValidateUserPassword>();
      const hashService = mock<PasswordHashing>();
      const useCase = new EmailUserUseCase(userRepo, specService, hashService);
      jest.spyOn(specService, "validatePassword").mockImplementation(() => {
        throw new Error();
      });
      await expect(
        useCase.addNewUser({
          email: "user@email",
          password: "password",
        } as any),
      ).rejects.toThrow();
    });

    it("should validate the write model for user", async () => {
      const userRepo = mock<UserRepository>();
      const specService = mock<ValidateUserPassword>();
      const hashService = mock<PasswordHashing>();
      const useCase = new EmailUserUseCase(userRepo, specService, hashService);
      await expect(
        useCase.addNewUser({ email: "invalid" } as any),
      ).rejects.toThrow();
      await expect(
        useCase.addNewUser({ email: "user@email" } as any),
      ).rejects.toThrow();
      await expect(
        useCase.addNewUser({ email: "user@email", password: "" } as any),
      ).rejects.toThrow();
    });

    it("should create a new user entity", async () => {
      const userRepo = mock<UserRepository>();
      const specService = mock<ValidateUserPassword>();
      const hashService = mock<PasswordHashing>();
      const useCase = new EmailUserUseCase(userRepo, specService, hashService);
      jest
        .spyOn(userRepo, "createUniqueOrThrow")
        .mockResolvedValue({ id: 2, email: "user@email" } as any);
      jest
        .spyOn(hashService, "hashPassword")
        .mockResolvedValue("randomsecurehashofthepassword");
      await useCase.addNewUser({
        email: "user@email",
        password: "something",
      } as any);
      expect(userRepo.createUniqueOrThrow).toBeCalledTimes(1);
      expect(userRepo.createUniqueOrThrow).toBeCalledWith({
        email: "user@email",
        password: expect.not.stringContaining("something"),
      });
      jest.restoreAllMocks();
    });

    it("should return the entity without password", async () => {
      const userRepo = mock<UserRepository>();
      const specService = mock<ValidateUserPassword>();
      const hashService = mock<PasswordHashing>();
      const useCase = new EmailUserUseCase(userRepo, specService, hashService);
      const hash = "randomsecurehashofthepassword";
      jest.spyOn(userRepo, "createUniqueOrThrow").mockResolvedValue({
        id: 2,
        email: "user@email",
        password: hash,
      } as any);
      jest.spyOn(hashService, "hashPassword").mockResolvedValue(hash);
      const result = await useCase.addNewUser({
        email: "user@email",
        password: "something",
      } as any);
      expect(result.email).toBe("user@email");
      expect((result as any).password).toBeUndefined();
    });
  });
});
