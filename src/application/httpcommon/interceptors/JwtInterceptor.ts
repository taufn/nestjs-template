import {
  CallHandler,
  ExecutionContext,
  Inject,
  NestInterceptor,
} from "@nestjs/common";

import { providerNames } from "../constants";
import { TokenManager } from "../contracts";
import { AttachedRequest } from "../models";
import { parseTokenFromRequest } from "~/utils/functions";

export class JwtInterceptor implements NestInterceptor {
  constructor(
    @Inject(providerNames.SERVICE_JWT_MANAGER)
    private readonly jwtManager: TokenManager,
  ) {}

  public async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<any> {
    const request: AttachedRequest = context.switchToHttp().getRequest();
    const token: string = parseTokenFromRequest(request);
    const payload = await this.jwtManager.verify(token);
    request.tokenPayload = { user: payload.user };
    return next.handle();
  }
}
