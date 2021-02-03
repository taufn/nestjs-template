import { TokenPayload } from "../models";

export interface TokenManager {
  generate(payload: TokenPayload): Promise<string>;
  verify(token: string): Promise<TokenPayload>;
}
