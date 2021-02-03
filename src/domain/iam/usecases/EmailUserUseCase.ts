import { Inject, Injectable } from "@nestjs/common";

import { providerNames } from "../configs";
import {
  AddNewUser,
  PasswordHashing,
  ValidateUserPassword,
} from "../contracts";
import { AddUserWithAuthProvider, AddUserWithPass, UserData } from "../dtos";
import { ProviderType, UserEntity } from "../entities";
import { UserRepository } from "../repositories";
import { Logger } from "~/utils/classes";

@Injectable()
export class EmailUserUseCase implements AddNewUser {
  private readonly logger = new Logger(EmailUserUseCase.name);

  constructor(
    @Inject(providerNames.REPO_USER)
    private readonly userRepo: UserRepository,
    @Inject(providerNames.SERVICE_PASSWORD_SPEC)
    private readonly passSpecService: ValidateUserPassword,
    @Inject(providerNames.SERVICE_PASSWORD_HASHING)
    private readonly hashService: PasswordHashing,
  ) {}

  public async addNewUser(
    params: AddUserWithPass | AddUserWithAuthProvider,
  ): Promise<UserData> {
    this.logger.log("Adding new user", { userEmail: params.email });
    this.passSpecService.validatePassword((params as AddUserWithPass).password);
    const user = new UserEntity();
    user.email = params.email;
    user.password = await this.hashService.hashPassword(
      (params as AddUserWithPass).password,
    );
    user.validateWriteModel(true);
    const created = await this.userRepo.createUniqueOrThrow(user);
    this.logger.log("Added new user", { userId: created.id });
    return this.mapUserData(created);
  }

  private mapUserData(raw: UserEntity): UserData {
    const dto = new UserData();
    dto.id = raw.id;
    dto.email = raw.email;
    dto.providerType = ProviderType.EMAIL;
    dto.createdAt = raw.createdAt;
    dto.updatedAt = raw.updatedAt;
    return dto;
  }
}
