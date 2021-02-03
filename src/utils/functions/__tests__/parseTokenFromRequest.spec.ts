import { parseTokenFromRequest } from "../parseTokenFromRequest";
import { headerNames } from "~/application/httpcommon/constants";

describe("utils/functions/parseTokenFromRequest", () => {
  it("should be defined", () => {
    expect(typeof parseTokenFromRequest).toBe("function");
  });

  it("should throw if request token is invalid", () => {
    expect(() => parseTokenFromRequest({} as any)).toThrow();
    expect(() =>
      parseTokenFromRequest({ [headerNames.TOKEN]: {} } as any),
    ).toThrow();
  });

  it("should return the token string", () => {
    expect(
      parseTokenFromRequest({ [headerNames.TOKEN]: "Bearer token" } as any),
    ).toBe("token");
  });
});
