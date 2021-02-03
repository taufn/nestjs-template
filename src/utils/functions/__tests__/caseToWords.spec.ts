/* eslint-disable sonarjs/no-duplicate-string */
import { caseToWords } from "../caseToWords";

describe("utils/functions/caseToWords", () => {
  it("should be defined", () => {
    expect(typeof caseToWords).toBe("function");
  });

  it("should convert snakecase to lowercase words", () => {
    expect(caseToWords("case_to_words")).toBe("case to words");
  });

  it("should convert camelcase to lowercase words", () => {
    expect(caseToWords("caseToWords")).toBe("case to words");
    expect(caseToWords("CaseToWords")).toBe("case to words");
  });

  it("should allow capitalizing each word", () => {
    expect(caseToWords("case_to_words", "word")).toBe("Case To Words");
    expect(caseToWords("caseToWords", "word")).toBe("Case To Words");
  });

  it("should allow capitalizing only first letter", () => {
    expect(caseToWords("case_to_words", "first")).toBe("Case to words");
    expect(caseToWords("caseToWords", "first")).toBe("Case to words");
  });
});
