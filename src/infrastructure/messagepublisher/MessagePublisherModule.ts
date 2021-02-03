import { Module } from "@nestjs/common";

import { providerNames } from "./configs";
import { services } from "./services";
import { rabbitConfig } from "~/utils/functions";

@Module({
  exports: [...services],
  providers: [
    {
      provide: providerNames.RABBIT_CONFIG,
      useFactory: rabbitConfig,
    },
    ...services,
  ],
})
export class MessagePublisherModule {}
