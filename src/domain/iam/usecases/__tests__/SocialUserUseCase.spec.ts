/* eslint-disable sonarjs/no-duplicate-string */
import { mock } from "jest-mock-extended";

import { ProviderType } from "../../entities";
import { AuthProviderRepository, UserRepository } from "../../repositories";
import { SocialUserUseCase } from "../SocialUserUseCase";

describe("domain/iam/usecases/SocialUserUseCase", () => {
  it("should be defined", () => {
    expect(typeof SocialUserUseCase).toBe("function");
  });

  describe("addNewUser()", () => {
    it("should be defined", () => {
      const userRepo = mock<UserRepository>();
      const authRepo = mock<AuthProviderRepository>();
      const useCase = new SocialUserUseCase(userRepo, authRepo);
      expect(typeof useCase.addNewUser).toBe("function");
    });

    it("should validate the write model for user", async () => {
      const userRepo = mock<UserRepository>();
      const authRepo = mock<AuthProviderRepository>();
      const useCase = new SocialUserUseCase(userRepo, authRepo);
      await expect(useCase.addNewUser({ email: "" } as any)).rejects.toThrow();
      await expect(
        useCase.addNewUser({ email: "invalid" } as any),
      ).rejects.toThrow();
    });

    it("should create a new user entity", async () => {
      const userRepo = mock<UserRepository>();
      const authRepo = mock<AuthProviderRepository>();
      const useCase = new SocialUserUseCase(userRepo, authRepo);
      const mockUser = { id: 2, email: "user@email" } as any;
      jest.spyOn(userRepo, "createUniqueOrThrow").mockResolvedValue(mockUser);
      jest.spyOn(authRepo, "createUniqueOrThrow").mockResolvedValue({
        id: 4,
        user: mockUser,
        providerType: ProviderType.SLACK,
        providerKey: "slackauthkey",
      } as any);
      await useCase.addNewUser({
        email: "user@email",
        providerType: ProviderType.SLACK,
        providerKey: "slackauthkey",
      } as any);
      expect(userRepo.createUniqueOrThrow).toBeCalledTimes(1);
      expect(userRepo.createUniqueOrThrow).toBeCalledWith({
        email: "user@email",
      });
      jest.restoreAllMocks();
    });

    it("should create necessary auth provider entity", async () => {
      const userRepo = mock<UserRepository>();
      const authRepo = mock<AuthProviderRepository>();
      const useCase = new SocialUserUseCase(userRepo, authRepo);
      const mockUser = { id: 2, email: "user@email" } as any;
      jest.spyOn(userRepo, "createUniqueOrThrow").mockResolvedValue(mockUser);
      jest.spyOn(authRepo, "createUniqueOrThrow").mockResolvedValue({
        id: 4,
        user: mockUser,
        providerType: ProviderType.SLACK,
        providerKey: "slackauthkey",
      } as any);
      await useCase.addNewUser({
        email: "user@email",
        providerType: ProviderType.SLACK,
        providerKey: "slackauthkey",
      } as any);
      expect(authRepo.createUniqueOrThrow).toBeCalledTimes(1);
      expect(authRepo.createUniqueOrThrow).toBeCalledWith({
        user: mockUser,
        providerType: ProviderType.SLACK,
        providerKey: "slackauthkey",
      });
      jest.restoreAllMocks();
    });

    it("should return the entity with correct provider type", async () => {
      const userRepo = mock<UserRepository>();
      const authRepo = mock<AuthProviderRepository>();
      const useCase = new SocialUserUseCase(userRepo, authRepo);
      const mockUser = { id: 2, email: "user@email" } as any;
      jest.spyOn(userRepo, "createUniqueOrThrow").mockResolvedValue(mockUser);
      jest.spyOn(authRepo, "createUniqueOrThrow").mockResolvedValue({
        id: 4,
        user: mockUser,
        providerType: ProviderType.SLACK,
        providerKey: "slackauthkey",
      } as any);
      const result = await useCase.addNewUser({
        email: "user@email",
        providerType: ProviderType.SLACK,
        providerKey: "slackauthkey",
      } as any);
      expect(result.email).toBe("user@email");
      expect(result.providerType).toBe(ProviderType.SLACK);
      jest.restoreAllMocks();
    });
  });
});
