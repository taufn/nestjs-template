import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { TokenManager } from "../contracts";
import { TokenPayload } from "../models";

@Injectable()
export class JwtManagerService implements TokenManager {
  constructor(private readonly jwtService: JwtService) {}

  public async generate(payload: TokenPayload): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  public async verify(token: string): Promise<TokenPayload> {
    const payload = await this.jwtService.verifyAsync<TokenPayload>(token);
    if (this.tokenPayloadIsValid(payload)) {
      return payload;
    }
    throw new UnauthorizedException();
  }

  private tokenPayloadIsValid(payload: TokenPayload): boolean {
    return (
      typeof payload.user?.id === "number" &&
      typeof payload.user?.email === "string" &&
      typeof payload.user?.providerType === "string"
    );
  }
}
