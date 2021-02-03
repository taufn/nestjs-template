import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "./BaseEntity";
import { UserEntity } from "./UserEntity";
import {
  AuthProviderEntity as AuthProviderEntityDomain,
  ProviderType,
} from "~/domain/iam/entities";

@Entity({ name: "auth_providers" })
export class AuthProviderEntity extends BaseEntity
  implements AuthProviderEntityDomain {
  @ManyToOne(
    () => UserEntity,
    user => user.authProviders,
  )
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @Column({ name: "provider_type", type: "enum", enum: ProviderType })
  providerType: ProviderType;

  @Column({ name: "provider_key", nullable: true })
  providerKey?: string;
}
