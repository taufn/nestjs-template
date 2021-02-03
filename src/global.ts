/* eslint-disable @typescript-eslint/naming-convention */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      __appdir__: string;
      __rootdir__: string;
    }
  }
}

const appDir = __dirname || process.cwd();
global.__appdir__ = appDir;
global.__rootdir__ = `${appDir}/..`;

export {};
