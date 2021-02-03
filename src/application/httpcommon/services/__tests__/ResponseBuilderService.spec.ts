/* eslint-disable @typescript-eslint/naming-convention */
import { statusCodes } from "../../constants";
import { ErrorPayloadDto } from "../../models";
import { ResponseBuilderService } from "../ResponseBuilderService";

describe("ResponseBuilderService", () => {
  let service: ResponseBuilderService;

  beforeEach(() => {
    service = new ResponseBuilderService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // eslint-disable-next-line sonarjs/no-duplicate-string
  it("should be defined", () => {
    expect(typeof ResponseBuilderService).toBe("function");
  });

  describe("success()", () => {
    it("should be defined", () => {
      expect(typeof service.success).toBe("function");
    });

    it("should return the formatted response", () => {
      const rawData = {
        fooBar: 1,
        baz: "job",
      };

      expect(service.success(rawData)).toEqual({
        data: { foo_bar: 1, baz: "job" },
        status: "success",
        status_code: statusCodes.success,
        meta: {},
      });
    });
  });

  describe("error()", () => {
    it("should be defined", () => {
      expect(typeof service.error).toBe("function");
    });

    it("should return the formatted response", () => {
      const error: ErrorPayloadDto = {
        type: "INTERNAL_SERVER_ERROR",
        message: "something went wrong",
      };

      expect(service.error([error])).toEqual({
        errors: [error],
        status: "error",
        status_code: statusCodes.genericError,
        meta: {},
      });
    });
  });
});
