import { AuthProviderEntity } from "../entities";
import {
  Repository,
  RepositoryCreateUniqueOrThrow,
} from "~/domain/common/contracts";

export interface AuthProviderRepository
  extends Repository<AuthProviderEntity>,
    RepositoryCreateUniqueOrThrow<AuthProviderEntity> {}
