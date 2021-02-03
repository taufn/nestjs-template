import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const stubConfig = (): { db: TypeOrmModuleOptions } => ({
  db: {
    type: process.env.TYPEORM_CONNECTION as any,
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    synchronize: process.env.TYPEORM_SYNCHRONIZE?.toLowerCase() === "true",
    logging: process.env.TYPEORM_LOGGING?.toLowerCase() === "true",
  },
});
