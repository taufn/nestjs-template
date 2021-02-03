import { AddUserWithAuthProvider, AddUserWithPass, UserData } from "../dtos";

export interface AddNewUser {
  addNewUser(params: AddUserWithPass): Promise<UserData>;
  addNewUser(params: AddUserWithAuthProvider): Promise<UserData>;
}

export interface ValidateUserPassword {
  validatePassword(value: string): void;
}
