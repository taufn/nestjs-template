import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import * as entities from "./entities";
import { repositories } from "./repositories";
import { Env } from "~/utils/classes";

@Module({
  exports: [...repositories],
  imports: [
    ConfigModule.forRoot({ envFilePath: Env.getEnvFilePath() }),
    TypeOrmModule.forRoot({
      type: process.env.TYPEORM_CONNECTION as any,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      host: process.env.TYPEORM_HOST,
      port: Number(process.env.TYPEORM_PORT),
      database: process.env.TYPEORM_DATABASE,
      synchronize: process.env.TYPEORM_SYNCHRONIZE?.toLowerCase() === "true",
      logging: process.env.TYPEORM_LOGGING?.toLowerCase() === "true",
      entities: Object.values(entities),
    }),
  ],
  providers: [...repositories],
})
export class DatabaseModule {}
