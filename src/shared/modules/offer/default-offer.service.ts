import { inject, injectable } from 'inversify';
import { types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { OfferService } from './offer-service.interface.js';
import { Component, CityName } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DEFAULT_OFFER_COUNT, PREMIUM_OFFER_COUNT } from './offer.constant.js';
import { UserService } from '../user/user-service.interface.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.UserService) private readonly userService: UserService
  ) {

  }

  public async create(dto: CreateOfferDto & { userId: string }): Promise<OfferEntity> {
    const result = await this.offerModel.create({
      ...dto,
      publishDate: dto.publishDate || new Date(),
      commentsCount: dto.commentsCount || 0,
      user: dto.userId,
      isFavorite: false
    });
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string, userId?: string): Promise<OfferEntity | null> {
    const offer = await this.offerModel.findById(offerId).populate('user').exec();
    if (!offer) {
      return null;
    }

    const offerObject = offer.toObject();
    if (userId) {
      const favorites = await this.userService.findFavorites(userId);
      offerObject.isFavorite = favorites.includes(offerId);
    } else {
      offerObject.isFavorite = false;
    }
    return offerObject as OfferEntity;
  }

  public async find(limit: number = DEFAULT_OFFER_COUNT, userId?: string): Promise<OfferEntity[]> {
    const offers = await this.offerModel
      .find()
      .limit(limit)
      .sort({ publishDate: -1 })
      .populate('user')
      .exec();

    if (userId) {
      const favorites = await this.userService.findFavorites(userId);
      return offers.map((offer) => {
        const offerObject = offer.toObject();
        offerObject.isFavorite = favorites.includes(offer.id);
        return offerObject as OfferEntity;
      });
    }

    return offers.map((offer) => {
      const offerObject = offer.toObject();
      offerObject.isFavorite = false;
      return offerObject as OfferEntity;
    });
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<OfferEntity | null> {
    const result = await this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate('user')
      .exec();

    if (result) {
      this.logger.info(`Offer updated: ${offerId}`);
    }

    return result;
  }

  public async deleteById(offerId: string): Promise<number> {
    const result = await this.offerModel.deleteOne({ _id: offerId }).exec();
    this.logger.info(`Offer deleted: ${offerId}`);

    return result.deletedCount;
  }

  public async findPremiumByCity(city: CityName, userId?: string): Promise<OfferEntity[]> {
    const offers = await this.offerModel
      .find({ city, isPremium: true })
      .limit(PREMIUM_OFFER_COUNT)
      .sort({ publishDate: -1 })
      .populate('user')
      .exec();

    if (userId) {
      const favorites = await this.userService.findFavorites(userId);
      return offers.map((offer) => {
        const offerObject = offer.toObject();
        offerObject.isFavorite = favorites.includes(offer.id);
        return offerObject as OfferEntity;
      });
    }

    return offers.map((offer) => {
      const offerObject = offer.toObject();
      offerObject.isFavorite = false;
      return offerObject as OfferEntity;
    });
  }

  public async incCommentCount(offerId: string): Promise<void> {
    await this.offerModel
      .findByIdAndUpdate(offerId, { $inc: { commentsCount: 1 } })
      .exec();
  }

  public async updateRating(offerId: string, rating: number): Promise<void> {
    await this.offerModel
      .findByIdAndUpdate(offerId, { rating })
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }
}
