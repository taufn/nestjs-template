import snakeCase = require("lodash.snakecase");

export function dbTableName(original: string, prefix?: string): string {
  const snaked = snakeCase(original);
  return prefix ? `${snakeCase(prefix)}_${snaked}` : snaked;
}
