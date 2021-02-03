/* eslint-disable sonarjs/no-duplicate-string */
import { mock } from "jest-mock-extended";
import { EntityManager } from "typeorm";

import { BaseRepository } from "../BaseRepository";
import { UserRepository } from "../UserRepository";

describe("infrastructure/database/repositories/UserRepository", () => {
  const entityManager = mock<EntityManager>();

  it("should be defined", () => {
    expect(typeof UserRepository).toBe("function");
  });

  it("should inherit base repository", () => {
    const repo = new UserRepository(entityManager);
    expect(repo instanceof BaseRepository).toBe(true);
  });

  describe("createUniqueOrThrow()", () => {
    it("should be defined", () => {
      const repo = new UserRepository(entityManager);
      expect(typeof repo.createUniqueOrThrow).toBe("function");
    });

    it("should create only after checking for uniqueness of auth provider", async () => {
      const repo = new UserRepository(entityManager);
      jest.spyOn(repo, "isUniqueOrThrow").mockResolvedValue(true);
      jest.spyOn(repo, "create").mockResolvedValue({} as any);
      await repo.createUniqueOrThrow({ email: "user@email" });
      expect(repo.isUniqueOrThrow).toBeCalledWith({ email: "user@email" });
      expect(repo.create).toBeCalledWith({ email: "user@email" });
      jest.restoreAllMocks();
    });

    it("should return created entity", async () => {
      const repo = new UserRepository(entityManager);
      const mockPayload = { email: "user@email" };
      jest.spyOn(repo, "isUniqueOrThrow").mockResolvedValue(true);
      jest
        .spyOn(repo, "create")
        .mockResolvedValue({ id: 12, ...mockPayload } as any);
      const result = await repo.createUniqueOrThrow(mockPayload);
      expect(result.email).toEqual(mockPayload.email);
      jest.restoreAllMocks();
    });
  });
});
