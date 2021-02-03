import { mock } from "jest-mock-extended";
import { EntityManager } from "typeorm";

import { AuthProviderRepository } from "../AuthProviderRepository";
import { BaseRepository } from "../BaseRepository";
import { ProviderType } from "~/domain/iam/entities";

describe("infrastructure/database/repositories/AuthProviderRepository", () => {
  const entityManager = mock<EntityManager>();

  it("should be defined", () => {
    expect(typeof AuthProviderRepository).toBe("function");
  });

  it("should inherit base repository", () => {
    const repo = new AuthProviderRepository(entityManager);
    expect(repo instanceof BaseRepository).toBe(true);
  });

  describe("createUniqueOrThrow()", () => {
    it("should be defined", () => {
      const repo = new AuthProviderRepository(entityManager);
      expect(typeof repo.createUniqueOrThrow).toBe("function");
    });

    it("should create only after checking for uniqueness of auth provider", async () => {
      const repo = new AuthProviderRepository(entityManager);
      jest.spyOn(repo, "isUniqueOrThrow").mockResolvedValue(true);
      jest.spyOn(repo, "create").mockResolvedValue({} as any);
      const mockUser = { email: "email" };
      await repo.createUniqueOrThrow({
        user: mockUser,
        providerType: ProviderType.EMAIL,
      });
      expect(repo.isUniqueOrThrow).toBeCalledWith({
        user: mockUser,
        providerType: ProviderType.EMAIL,
      });
      expect(repo.create).toBeCalledWith({
        user: mockUser,
        providerType: ProviderType.EMAIL,
      });
      jest.restoreAllMocks();
    });

    it("should return created entity", async () => {
      const repo = new AuthProviderRepository(entityManager);
      const mockPayload = {
        user: { email: "user@email" },
        providerType: ProviderType.SLACK,
        providerKey: "slackkey",
      } as any;
      jest.spyOn(repo, "isUniqueOrThrow").mockResolvedValue(true);
      jest.spyOn(repo, "create").mockResolvedValue({ id: 1, ...mockPayload });
      const result = await repo.createUniqueOrThrow(mockPayload);
      expect(result.user).toEqual(mockPayload.user);
      expect(result.providerType).toBe(mockPayload.providerType);
      expect(result.providerKey).toBe(mockPayload.providerKey);
      jest.restoreAllMocks();
    });
  });
});
