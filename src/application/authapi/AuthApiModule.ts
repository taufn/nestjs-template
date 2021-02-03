import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { HttpCommonModule } from "../httpcommon/HttpCommonModule";
import { controllers } from "./controllers";
import { IamModule } from "~/domain/iam/IamModule";
import { Env } from "~/utils/classes";

@Module({
  controllers: [...controllers],
  imports: [
    ConfigModule.forRoot({ envFilePath: Env.getEnvFilePath() }),
    HttpCommonModule,
    IamModule,
  ],
})
export class AuthApiModule {}
