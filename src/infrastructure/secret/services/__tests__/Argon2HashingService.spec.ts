/* eslint-disable sonarjs/no-duplicate-string */
import argon2 = require("argon2");

import { Argon2HashingService } from "../Argon2HashingService";

describe("infrastructure/secret/services/Argon2HashingService", () => {
  it("should be defined", () => {
    expect(typeof Argon2HashingService).toBe("function");
  });

  describe("hashPassword()", () => {
    it("should be defined", () => {
      const service = new Argon2HashingService();
      expect(typeof service.hashPassword).toBe("function");
    });

    it("should throw 500 if hashing failed", async () => {
      jest.spyOn(argon2, "hash").mockRejectedValue(new Error());
      const service = new Argon2HashingService();
      await expect(service.hashPassword("bad")).rejects.toThrow(/internal/gi);
      jest.restoreAllMocks();
    });

    it("should return hashed string when ok", async () => {
      jest.spyOn(argon2, "hash").mockResolvedValue("hashed");
      const service = new Argon2HashingService();
      const hash = await service.hashPassword("good");
      expect(hash).toBe("hashed");
      jest.restoreAllMocks();
    });
  });

  describe("validatePasswordOrThrow()", () => {
    it("should be defined", () => {
      const service = new Argon2HashingService();
      expect(typeof service.validatePasswordOrThrow).toBe("function");
    });

    it("should throw 500 if verification failed", async () => {
      jest.spyOn(argon2, "verify").mockRejectedValue(new Error());
      const service = new Argon2HashingService();
      await expect(
        service.validatePasswordOrThrow("bad", "hash"),
      ).rejects.toThrow(/internal/gi);
      jest.restoreAllMocks();
    });

    it("should throw 400 if match is not verified", async () => {
      jest.spyOn(argon2, "verify").mockResolvedValue(false);
      const service = new Argon2HashingService();
      await expect(
        service.validatePasswordOrThrow("bad", "hash"),
      ).rejects.toThrow(/credential/gi);
      jest.restoreAllMocks();
    });

    it("should not throw if match is verified", async () => {
      jest.spyOn(argon2, "verify").mockResolvedValue(true);
      const service = new Argon2HashingService();
      await expect(
        service.validatePasswordOrThrow("bad", "hash"),
      ).resolves.not.toThrow();
      jest.restoreAllMocks();
    });
  });
});
