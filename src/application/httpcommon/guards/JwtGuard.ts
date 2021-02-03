import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from "@nestjs/common";

import { providerNames } from "../constants";
import { TokenManager } from "../contracts";
import { parseTokenFromRequest } from "~/utils/functions";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    @Inject(providerNames.SERVICE_JWT_MANAGER)
    private readonly jwtManager: TokenManager,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token: string = parseTokenFromRequest(request);
    await this.jwtManager.verify(token);
    return true;
  }
}
