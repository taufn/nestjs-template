import { Provider } from "@nestjs/common";

import { providerNames } from "../constants";
import { JwtManagerService } from "./JwtManagerService";
import { ResponseBuilderService } from "./ResponseBuilderService";

export const services: Provider[] = [
  {
    provide: providerNames.SERVICE_JWT_MANAGER,
    useClass: JwtManagerService,
  },
  {
    provide: providerNames.SERVICE_RESP_BUILDER,
    useClass: ResponseBuilderService,
  },
];
