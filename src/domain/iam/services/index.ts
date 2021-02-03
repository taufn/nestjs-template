import { Provider } from "@nestjs/common";

import { providerNames } from "../configs";
import { PasswordValidationService } from "./PasswordValidationService";

export const services: Provider[] = [
  {
    provide: providerNames.SERVICE_PASSWORD_SPEC,
    useClass: PasswordValidationService,
  },
];
