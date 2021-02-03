import * as fs from "fs";
import * as path from "path";

import "~/global";
import { FileNotFoundException } from "../exceptions";

export class Env {
  public static getEnv(): string {
    return (
      (
        process.env.NODE_ENV ||
        process.env.APP_ENV ||
        process.env.ENV
      )?.toLowerCase() || ""
    );
  }

  public static getEnvFilePath(): string {
    const rootDir = global.__rootdir__;
    const configDir = `${rootDir}/configs/env`;
    const targetFile = this.isTest()
      ? `${configDir}/.env.test`
      : `${rootDir}/.env`;
    const resolvedPath = path.resolve(__dirname, targetFile);

    if (!fs.existsSync(resolvedPath)) {
      throw new FileNotFoundException(resolvedPath);
    }
    return resolvedPath;
  }

  public static isTest(): boolean {
    const env = this.getEnv();
    return !!env.match("test");
  }

  public static isLive(): boolean {
    const env = this.getEnv();
    return ["development", "test"].indexOf(env) < 0;
  }
}
