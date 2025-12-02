import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);
    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index as any });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create as any });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.show as any });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.update as any });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete as any });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremiumByCity as any });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    this.ok(res, offers);
  }

  public async show(
    { params }: Request<{ offerId: string }>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController'
      );
    }

    this.ok(res, offer);
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response,
  ): Promise<void> {
    const result = await this.offerService.create(body);
    this.created(res, result);
  }

  public async update(
    { body, params }: Request<{ offerId: string }, Record<string, unknown>, UpdateOfferDto>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;
    const updatedOffer = await this.offerService.updateById(offerId, body);

    if (!updatedOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController'
      );
    }

    this.ok(res, updatedOffer);
  }

  public async delete(
    { params }: Request<{ offerId: string }>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const deletedOffer = await this.offerService.deleteById(offerId);

    if (!deletedOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController'
      );
    }

    this.noContent(res, deletedOffer);
  }

  public async getPremiumByCity(
    { params }: Request,
    res: Response
  ): Promise<void> {
    const { city } = params;
    const offers = await this.offerService.findPremiumByCity(city as any);
    this.ok(res, offers);
  }
}
