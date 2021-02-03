import { UserEntity } from "./UserEntity";

export enum ProviderType {
  EMAIL = "EMAIL",
  SLACK = "SLACK",
}

export class AuthProviderEntity {
  id?: number;
  user: UserEntity;
  providerType: ProviderType;
  providerKey?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
