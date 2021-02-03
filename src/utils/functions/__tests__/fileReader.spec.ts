import * as fs from "fs";
import * as path from "path";

import "~/global";
import { fileReader } from "../fileReader";
import { FileNotFoundException } from "~/utils/exceptions";

// !IMPORTANT
// to be safe, use `mock[Operation]Once()` on `path` and `fs` as both module is
// also being used by jest
// not using the once variant would mock the module for the whole test, causing
// jest not able to correctly load the test files

describe("utils/functions/fileReader", () => {
  it("should be defined", () => {
    expect(typeof fileReader).toBe("function");
  });

  it("should throw when resolved path does not exist", () => {
    jest.spyOn(path, "resolve").mockReturnValueOnce("resolvedpath");
    jest.spyOn(fs, "existsSync").mockReturnValueOnce(false);
    expect(() => fileReader("path")).toThrow(FileNotFoundException);
  });

  it("should return string representation of file content when found", () => {
    jest.spyOn(path, "resolve").mockReturnValueOnce("resolvedpath");
    jest.spyOn(fs, "existsSync").mockReturnValueOnce(true);
    jest
      .spyOn(fs, "readFileSync")
      .mockReturnValueOnce(Buffer.from("mockcontent"));
    expect(fileReader("path")).toBe("mockcontent");
  });

  it("should allow passing multiple string as file paths", () => {
    jest.spyOn(path, "resolve").mockReturnValueOnce("resolvedpath");
    jest.spyOn(fs, "existsSync").mockReturnValueOnce(true);
    jest
      .spyOn(fs, "readFileSync")
      .mockReturnValueOnce(Buffer.from("mockcontent"));
    expect(() => fileReader("one", "two", "three")).not.toThrow();
  });
});
