import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import argon2 = require("argon2");

import { PasswordHashing } from "~/domain/iam/contracts";
import { Logger } from "~/utils/classes";

@Injectable()
export class Argon2HashingService implements PasswordHashing {
  private readonly logger = new Logger(Argon2HashingService.name);

  public async hashPassword(literal: string): Promise<string> {
    try {
      return await argon2.hash(literal);
    } catch (error) {
      this.logger.error("Argon2 hashing failed", (error as Error).stack);
      throw new InternalServerErrorException();
    }
  }

  public async validatePasswordOrThrow(
    literal: string,
    hash: string,
  ): Promise<void> {
    let match = false;

    try {
      match = await argon2.verify(hash, literal);
    } catch (error) {
      this.logger.error("Argon2 verification failed", (error as Error).stack);
      throw new InternalServerErrorException();
    }

    if (!match) {
      throw new BadRequestException("Incorrect credential given");
    }
  }
}
