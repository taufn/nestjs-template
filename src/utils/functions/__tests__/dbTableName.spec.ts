import { dbTableName } from "../dbTableName";

describe("utils/functions/dbTableName", () => {
  it("should be defined", () => {
    expect(typeof dbTableName).toBe("function");
  });

  it("should convert original name to lower snakecase", () => {
    expect(dbTableName("ALLCAPS")).toBe("allcaps");
    expect(dbTableName("PascalCase")).toBe("pascal_case");
    expect(dbTableName("camelCase")).toBe("camel_case");
    expect(dbTableName("kebab-case")).toBe("kebab_case");
    expect(dbTableName("multi words")).toBe("multi_words");
    expect(dbTableName("First Last")).toBe("first_last");
  });

  it("should allow add prefix", () => {
    expect(dbTableName("table name", "pre")).toBe("pre_table_name");
  });

  it("should also snakecase the prefix", () => {
    expect(dbTableName("table name", "lowHigh")).toBe("low_high_table_name");
  });
});
