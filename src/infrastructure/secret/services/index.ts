import { Provider } from "@nestjs/common";

import { Argon2HashingService } from "./Argon2HashingService";
import { providerNames as iamProviderNames } from "~/domain/iam/configs";

export const services: Provider[] = [
  {
    provide: iamProviderNames.SERVICE_PASSWORD_HASHING,
    useClass: Argon2HashingService,
  },
];
