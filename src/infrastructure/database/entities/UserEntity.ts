import { Column, Entity, OneToMany } from "typeorm";

import { AuthProviderEntity } from "./AuthProviderEntity";
import { BaseEntity } from "./BaseEntity";
import { UserEntity as UserEntityDomain } from "~/domain/iam/entities";

@Entity({ name: "users" })
export class UserEntity extends BaseEntity implements UserEntityDomain {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @OneToMany(
    () => AuthProviderEntity,
    authProvider => authProvider.user,
  )
  authProviders?: AuthProviderEntity[];
}
