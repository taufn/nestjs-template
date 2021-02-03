import { ProviderType } from "../entities";

export class AddUserWithPass {
  email: string;
  password: string;
}

export class AddUserWithAuthProvider {
  email: string;
  providerType: ProviderType;
  providerKey: string;
}

export class UserData {
  id: number;
  email: string;
  providerType: ProviderType;
  createdAt?: Date;
  updatedAt?: Date;
}
