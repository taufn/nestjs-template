import * as fs from "fs";
import * as path from "path";

import "~/global";
import { FileNotFoundException } from "~/utils/exceptions";

export function fileReader(...filepaths: string[]): string {
  const resolvedPath = path.resolve(global.__rootdir__, ...filepaths);
  if (!fs.existsSync(resolvedPath)) {
    throw new FileNotFoundException(resolvedPath);
  }
  const readBuffer = fs.readFileSync(resolvedPath);
  return readBuffer.toString();
}
