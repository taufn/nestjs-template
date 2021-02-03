/* eslint-disable sonarjs/no-duplicate-string */
import { JwtService } from "@nestjs/jwt";
import { mock } from "jest-mock-extended";

import { JwtManagerService } from "../JwtManagerService";

describe("application/authapi/services/JwtManagerService", () => {
  it("should be defined", () => {
    expect(typeof JwtManagerService).toBe("function");
  });

  describe("generate()", () => {
    it("should be defined", () => {
      const jwtService = mock<JwtService>();
      const service = new JwtManagerService(jwtService);
      expect(typeof service.generate).toBe("function");
    });

    it("should generate a new token with specified payload", async () => {
      const jwtService = mock<JwtService>();
      const service = new JwtManagerService(jwtService);
      const user = { email: "user@email" } as any;
      const mockToken = "superrandomstring";
      jest.spyOn(jwtService, "signAsync").mockResolvedValue(mockToken);
      const token = await service.generate({ user });
      expect(jwtService.signAsync).toBeCalledWith({ user });
      expect(token).toBe(mockToken);
      jest.restoreAllMocks();
    });
  });

  describe("verify()", () => {
    it("should be defined", () => {
      const jwtService = mock<JwtService>();
      const service = new JwtManagerService(jwtService);
      expect(typeof service.verify).toBe("function");
    });

    it("should validate the token payload", async () => {
      const jwtService = mock<JwtService>();
      const service = new JwtManagerService(jwtService);
      const verifySpy = jest
        .spyOn(jwtService, "verifyAsync")
        .mockResolvedValue({ foo: "bar" });
      await expect(service.verify("token")).rejects.toThrow();
      verifySpy.mockResolvedValue({ user: {} });
      await expect(service.verify("token")).rejects.toThrow();
      verifySpy.mockResolvedValue({ user: { id: 1 } });
      await expect(service.verify("token")).rejects.toThrow();
      verifySpy.mockResolvedValue({ user: { id: 1, email: "user@email.com" } });
      await expect(service.verify("token")).rejects.toThrow();
      verifySpy.mockResolvedValue({
        user: { id: 1, email: "user@email.com", providerType: "something" },
      });
      await expect(service.verify("token")).resolves.not.toThrow();
      expect(jwtService.verifyAsync).toBeCalledTimes(5);
      jest.restoreAllMocks();
    });

    it("should return the payload", async () => {
      const jwtService = mock<JwtService>();
      const service = new JwtManagerService(jwtService);
      jest.spyOn(jwtService, "verifyAsync").mockResolvedValue({
        user: { id: 1, email: "user@email.com", providerType: "something" },
      });
      const payload = await service.verify("token");
      expect(payload.user).toBeDefined();
      jest.restoreAllMocks();
    });
  });
});
