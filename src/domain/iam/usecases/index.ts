import { Provider } from "@nestjs/common";

import { providerNames } from "../configs";
import { EmailUserUseCase } from "./EmailUserUseCase";
import { SocialUserUseCase } from "./SocialUserUseCase";

export const useCases: Provider[] = [
  {
    provide: providerNames.USE_CASE_EMAIL_USER,
    useClass: EmailUserUseCase,
  },
  {
    provide: providerNames.USE_CASE_SOCIAL_USER,
    useClass: SocialUserUseCase,
  },
];
