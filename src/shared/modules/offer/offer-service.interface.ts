import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { DocumentExists, CityName } from '../../types/index.js';

export interface OfferService extends DocumentExists {
  create(dto: CreateOfferDto & { userId: string }): Promise<OfferEntity>;
  findById(offerId: string, userId?: string): Promise<OfferEntity | null>;
  find(limit?: number, userId?: string): Promise<OfferEntity[]>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<OfferEntity | null>;
  deleteById(offerId: string): Promise<number>;
  findPremiumByCity(city: CityName, userId?: string): Promise<OfferEntity[]>;
  incCommentCount(offerId: string): Promise<void>;
  updateRating(offerId: string, rating: number): Promise<void>;
}
