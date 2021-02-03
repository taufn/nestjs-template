import { Provider } from "@nestjs/common";

import { providerNames } from "../configs";
import { RabbitPublisherService } from "./RabbitPublisherService";

export const services: Provider[] = [
  {
    provide: providerNames.SERVICE_RABBIT_PUBLISHER,
    useClass: RabbitPublisherService,
  },
];
