import { Module } from "@nestjs/common";

import { services } from "./services";

@Module({
  exports: [...services],
  providers: [...services],
})
export class MessageModule {}
