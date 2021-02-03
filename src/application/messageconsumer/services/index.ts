import { Provider } from "@nestjs/common";

import { RabbitSubscriberService } from "./RabbitSubscriberService";

export const services: Provider[] = [RabbitSubscriberService];
