import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { services } from "./services";
import { Env } from "~/utils/classes";

@Module({
  exports: [...services],
  imports: [
    ConfigModule.forRoot({ envFilePath: Env.getEnvFilePath() }),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  providers: [...services],
})
export class HttpCommonModule {}
