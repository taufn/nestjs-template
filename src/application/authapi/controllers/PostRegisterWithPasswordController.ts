import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";

import { docsTags, routingV1 } from "../configs";
import { JwtResponseDto, UserWithPassword } from "../models";
import { providerNames as httpProviderNames } from "~/application/httpcommon/constants";
import {
  ResponseBuilder,
  TokenManager,
} from "~/application/httpcommon/contracts";
import { providerNames as iamProviderNames } from "~/domain/iam/configs";
import { AddNewUser } from "~/domain/iam/contracts";

@ApiTags(docsTags.ACCOUNT)
@Controller(routingV1.PREFIX)
export class PostRegisterWithPasswordController {
  constructor(
    @Inject(iamProviderNames.USE_CASE_EMAIL_USER)
    private readonly useCase: AddNewUser,
    @Inject(httpProviderNames.SERVICE_RESP_BUILDER)
    private readonly respBuilder: ResponseBuilder,
    @Inject(httpProviderNames.SERVICE_JWT_MANAGER)
    private readonly jwtManager: TokenManager,
  ) {}

  @ApiCreatedResponse({ type: JwtResponseDto })
  @Post(routingV1.ACCOUNT.REGISTER.WITH_PASSWORD)
  public async postRegisterWithPassword(
    @Body() params: UserWithPassword,
  ): Promise<JwtResponseDto> {
    const user = await this.useCase.addNewUser(params);
    const token = await this.jwtManager.generate({ user });
    return this.respBuilder.success({ token });
  }
}
