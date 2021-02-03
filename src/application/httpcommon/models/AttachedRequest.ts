import { Request } from "express";

import { TokenPayload } from "./TokenPayload";

export interface AttachedRequest extends Request {
  tokenPayload?: TokenPayload;
}
