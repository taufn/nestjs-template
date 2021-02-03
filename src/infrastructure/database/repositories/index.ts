import { Provider } from "@nestjs/common";

import { AuthProviderRepository } from "./AuthProviderRepository";
import { UserRepository } from "./UserRepository";
import { providerNames as iamProviderNames } from "~/domain/iam/configs";

export const repositories: Provider[] = [
  {
    provide: iamProviderNames.REPO_AUTH_PROVIDER,
    useClass: AuthProviderRepository,
  },
  {
    provide: iamProviderNames.REPO_USER,
    useClass: UserRepository,
  },
];
