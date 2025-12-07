import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpMethod, ValidateObjectIdMiddleware, ValidateDtoMiddleware, DocumentExistsMiddleware } from '../../libs/rest/index.js';
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

    const validateOfferIdMiddleware = new ValidateObjectIdMiddleware('offerId');
    const validateCreateOfferDtoMiddleware = new ValidateDtoMiddleware(CreateOfferDto);
    const validateUpdateOfferDtoMiddleware = new ValidateDtoMiddleware(UpdateOfferDto);
    const documentExistsMiddleware = new DocumentExistsMiddleware(this.offerService, 'offerId', 'Offer');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index as any });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create as any,
      middlewares: [validateCreateOfferDtoMiddleware]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show as any,
      middlewares: [validateOfferIdMiddleware, documentExistsMiddleware]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update as any,
      middlewares: [validateOfferIdMiddleware, validateUpdateOfferDtoMiddleware, documentExistsMiddleware]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete as any,
      middlewares: [validateOfferIdMiddleware, documentExistsMiddleware]
    });
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
    this.ok(res, updatedOffer);
  }

  public async delete(
    { params }: Request<{ offerId: string }>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    await this.offerService.deleteById(offerId);
    this.noContent(res, null);
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
