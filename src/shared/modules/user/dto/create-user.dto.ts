import { UserType } from '../../../types/index.js';

export class CreateUserDto {
  public name!: string;
  public email!: string;
  public avatarUrl?: string;
  public password!: string;
  public type!: UserType;
}
