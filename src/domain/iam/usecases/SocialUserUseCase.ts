import { Inject, Injectable } from "@nestjs/common";

import { providerNames } from "../configs";
import { AddNewUser } from "../contracts";
import { AddUserWithAuthProvider, AddUserWithPass, UserData } from "../dtos";
import { AuthProviderEntity, UserEntity } from "../entities";
import { AuthProviderRepository, UserRepository } from "../repositories";
import { Logger } from "~/utils/classes";

@Injectable()
export class SocialUserUseCase implements AddNewUser {
  private readonly logger = new Logger(SocialUserUseCase.name);

  constructor(
    @Inject(providerNames.REPO_USER)
    private readonly userRepo: UserRepository,
    @Inject(providerNames.REPO_AUTH_PROVIDER)
    private readonly authRepo: AuthProviderRepository,
  ) {}

  public async addNewUser(
    params: AddUserWithPass | AddUserWithAuthProvider,
  ): Promise<UserData> {
    this.logger.log("Adding new user", { userEmail: params.email });
    const casted = params as AddUserWithAuthProvider;
    const payload = new UserEntity();
    payload.email = casted.email;
    payload.validateWriteModel();
    const user = await this.userRepo.createUniqueOrThrow(payload);
    const provider = await this.authRepo.createUniqueOrThrow({
      user,
      providerType: casted.providerType,
      providerKey: casted.providerKey,
    });
    this.logger.log("Added new user", {
      userId: user.id,
      providerId: provider.id,
    });
    return this.mapUserData(user, provider);
  }

  private mapUserData(
    user: UserEntity,
    provider: AuthProviderEntity,
  ): UserData {
    const dto = new UserData();
    dto.id = user.id;
    dto.email = user.email;
    dto.providerType = provider.providerType;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }
}
