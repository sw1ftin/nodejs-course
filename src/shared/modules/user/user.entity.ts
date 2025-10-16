import { prop, modelOptions, getModelForClass } from '@typegoose/typegoose';
import { UserType } from '../../types/index.js';

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true
  }
})
export class UserEntity {
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
