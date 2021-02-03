import { BadRequestException } from "@nestjs/common";

import { AuthProviderEntity } from "./AuthProviderEntity";

export class UserEntity {
  id?: number;
  email: string;
  password?: string;
  authProviders?: AuthProviderEntity[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  public validateWriteModel?(withPassword = false): void {
    if (!this.email || !this.email.match("@")) {
      throw new BadRequestException("Email address should be filled correctly");
    }
    if (withPassword && !this.password) {
      throw new BadRequestException("Password should be filled correctly");
    }
  }
}
