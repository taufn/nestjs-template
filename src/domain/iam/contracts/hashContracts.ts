export interface PasswordHashing {
  hashPassword(literal: string): Promise<string>;
  validatePasswordOrThrow(literal: string, hash: string): Promise<void>;
}
