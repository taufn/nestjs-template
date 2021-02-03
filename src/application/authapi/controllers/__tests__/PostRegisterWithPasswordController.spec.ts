import { mock } from "jest-mock-extended";

import { PostRegisterWithPasswordController } from "../PostRegisterWithPasswordController";
import {
  ResponseBuilder,
  TokenManager,
} from "~/application/httpcommon/contracts";
import { AddNewUser } from "~/domain/iam/contracts";

describe("application/authapi/controllers/PostRegisterWithPasswordController", () => {
  it("should be defined", () => {
    expect(typeof PostRegisterWithPasswordController).toBe("function");
  });

  describe("postRegisterWithPassword()", () => {
    it("should be defined", () => {
      const useCase = mock<AddNewUser>();
      const respBuilder = mock<ResponseBuilder>();
      const jwtManager = mock<TokenManager>();
      const controller = new PostRegisterWithPasswordController(
        useCase,
        respBuilder,
        jwtManager,
      );
      expect(typeof controller.postRegisterWithPassword).toBe("function");
    });

    it("should register the user using password", async () => {
      const useCase = mock<AddNewUser>();
      const respBuilder = mock<ResponseBuilder>();
      const jwtManager = mock<TokenManager>();
      const controller = new PostRegisterWithPasswordController(
        useCase,
        respBuilder,
        jwtManager,
      );
      const mockUser = { id: 9 } as any;
      jest.spyOn(useCase, "addNewUser").mockResolvedValue(mockUser);
      jest.spyOn(jwtManager, "generate").mockResolvedValue("token");
      jest
        .spyOn(respBuilder, "success")
        .mockImplementation(data => ({ data } as any));
      const params = { email: "email", password: "password" };
      const result = await controller.postRegisterWithPassword(params);
      expect(useCase.addNewUser).toBeCalledTimes(1);
      expect(useCase.addNewUser).toBeCalledWith(params);
      expect(jwtManager.generate).toBeCalledWith({ user: mockUser });
      expect(result).toBeDefined();
      expect(result.data).toEqual({ token: "token" });
    });
  });
});
