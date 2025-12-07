import { inject, injectable } from 'inversify';
import { types } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { CommentService } from './comment-service.interface.js';
import { OfferService } from '../offer/offer-service.interface.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DEFAULT_COMMENT_COUNT } from './comment.constant.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {}

  public async create(dto: CreateCommentDto & { authorId: string }): Promise<CommentEntity> {
    const comment = await this.commentModel.create({
      ...dto,
      author: dto.authorId,
      offer: dto.offerId,
      publishDate: new Date(),
    });
    this.logger.info(`New comment created for offer: ${dto.offerId}`);

    await this.offerService.incCommentCount(dto.offerId);

    await this.calculateAndUpdateRating(dto.offerId);

    return comment.populate('author');
  }

  public async findByOfferId(
    offerId: string,
    limit: number = DEFAULT_COMMENT_COUNT,
  ): Promise<CommentEntity[]> {
    return this.commentModel
      .find({ offer: offerId })
      .limit(limit)
      .sort({ publishDate: -1 })
      .populate('author')
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({ offer: offerId })
      .exec();

    return result.deletedCount;
  }

  private async calculateAndUpdateRating(offerId: string): Promise<void> {
    const result = await this.commentModel
      .aggregate([
        { $match: { offer: { $eq: offerId } } },
        {
          $group: {
            _id: null,
            avgRating: { $avg: '$rating' },
          },
        },
      ])
      .exec();

    const averageRating =
      result.length > 0 ? Math.round(result[0].avgRating * 10) / 10 : 0;
    await this.offerService.updateRating(offerId, averageRating);
  }
}
