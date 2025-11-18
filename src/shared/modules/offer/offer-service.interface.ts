import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { DocumentExists } from '../../types/index.js';

export interface OfferService extends DocumentExists {
  create(dto: CreateOfferDto): Promise<OfferEntity>;
  findById(offerId: string): Promise<OfferEntity | null>;
}
