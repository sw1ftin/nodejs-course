import { prop, modelOptions, Ref, getModelForClass, defaultClasses } from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js';
import { OfferEntity } from '../offer/offer.entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, minlength: 5, maxlength: 1024 })
  public text!: string;

  @prop({ required: true })
  public publishDate!: Date;

  @prop({ required: true, min: 1, max: 5 })
  public rating!: number;

  @prop({ required: true, ref: () => UserEntity })
  public author!: Ref<UserEntity>;

  @prop({ required: true, ref: () => OfferEntity })
  public offer!: Ref<OfferEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
