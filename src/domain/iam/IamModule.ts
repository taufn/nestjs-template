import { Module } from "@nestjs/common";

import { services } from "./services";
import { useCases } from "./usecases";
import { DatabaseModule } from "~/infrastructure/database/DatabaseModule";
import { SecretModule } from "~/infrastructure/secret/SecretModule";

@Module({
  exports: [...useCases],
  imports: [DatabaseModule, SecretModule],
  providers: [...services, ...useCases],
})
export class IamModule {}
