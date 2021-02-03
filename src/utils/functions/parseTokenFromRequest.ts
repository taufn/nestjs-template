import { UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

import { headerNames } from "~/application/httpcommon/constants";

export function parseTokenFromRequest(request: Request): string {
  const token: string = request[headerNames.TOKEN];
  if (!token || typeof token !== "string") {
    throw new UnauthorizedException();
  }
  return token.replace("Bearer ", "");
}
