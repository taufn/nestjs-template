import { UserEntity } from "../entities";
import {
  Repository,
  RepositoryCreateUniqueOrThrow,
} from "~/domain/common/contracts";

export interface UserRepository
  extends Repository<UserEntity>,
    RepositoryCreateUniqueOrThrow<UserEntity> {}
