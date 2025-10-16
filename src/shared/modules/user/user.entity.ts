import { prop, modelOptions, getModelForClass, defaultClasses } from '@typegoose/typegoose';
import { UserType } from '../../types/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps {
  @prop({ required: true })
  public name!: string;

  @prop({ unique: true, required: true })
  public email!: string;

  @prop()
  public avatarUrl?: string;

  @prop({ required: true })
  public password!: string;

  @prop({ required: true, type: () => String, enum: UserType })
  public type!: UserType;
}

export const UserModel = getModelForClass(UserEntity);
