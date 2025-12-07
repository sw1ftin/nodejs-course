import { IsEmail, IsEnum, IsOptional, IsString, Length } from "class-validator";
import { UserType } from "../../../types/index.js";

export class CreateUserDto {
  @IsString({ message: "name is required" })
  @Length(1, 15, { message: "name length must be between 1 and 15 characters" })
  public name!: string;

  @IsEmail({}, { message: "email must be a valid email address" })
  public email!: string;

  @IsOptional()
  @IsString({ message: "avatarUrl must be a string" })
  public avatarUrl?: string;

  @IsString({ message: "password is required" })
  @Length(6, 12, {
    message: "password length must be between 6 and 12 characters",
  })
  public password!: string;

  @IsEnum(UserType, { message: "type must be one of: default, pro" })
  public type!: UserType;
}
