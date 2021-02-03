import { DynamicModule, Module } from "@nestjs/common";

import { providerNames } from "./configs";
import { services } from "./services";
import { RabbitConfig, rabbitConfig } from "~/utils/functions";

@Module({
  exports: [...services],
  providers: [...services],
})
export class MessageConsumerModule {
  static register(options?: Partial<RabbitConfig>): DynamicModule {
    return {
      module: MessageConsumerModule,
      exports: [...services],
      providers: [
        {
          provide: providerNames.RABBIT_CONFIG,
          useFactory: () => ({
            ...rabbitConfig(),
            ...options,
          }),
        },
        ...services,
      ],
    };
  }
}
