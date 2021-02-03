import { EntityManager, EntityRepository } from "typeorm";

import { UserEntity } from "../entities";
import { BaseRepository } from "./BaseRepository";
import { UserRepository as UserRepositoryContract } from "~/domain/iam/repositories";

@EntityRepository(UserEntity)
export class UserRepository extends BaseRepository<UserEntity>
  implements UserRepositoryContract {
  constructor(manager: EntityManager) {
    super(manager, UserEntity);
  }

  public async createUniqueOrThrow(payload: UserEntity): Promise<UserEntity> {
    await this.isUniqueOrThrow({ email: payload.email });
    return await this.create(payload);
  }
}
