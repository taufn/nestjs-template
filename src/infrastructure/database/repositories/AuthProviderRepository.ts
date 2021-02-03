import { EntityManager, EntityRepository } from "typeorm";

import { AuthProviderEntity } from "../entities";
import { BaseRepository } from "./BaseRepository";
import { AuthProviderRepository as AuthProviderRepositoryContract } from "~/domain/iam/repositories";

@EntityRepository(AuthProviderEntity)
export class AuthProviderRepository extends BaseRepository<AuthProviderEntity>
  implements AuthProviderRepositoryContract {
  constructor(manager: EntityManager) {
    super(manager, AuthProviderEntity);
  }

  public async createUniqueOrThrow(
    payload: AuthProviderEntity,
  ): Promise<AuthProviderEntity> {
    await this.isUniqueOrThrow({
      user: payload.user,
      providerType: payload.providerType,
    });
    return await this.create(payload);
  }
}
