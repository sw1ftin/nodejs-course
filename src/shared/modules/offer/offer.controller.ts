import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, HttpMethod, ValidateObjectIdMiddleware, ValidateDtoMiddleware, DocumentExistsMiddleware, AuthenticateMiddleware, HttpError, OptionalAuthenticateMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { JwtService } from '../../libs/jwt/index.js';

@injectable()
export class OfferController extends BaseController {
  private readonly authenticateMiddleware: AuthenticateMiddleware;
  private readonly optionalAuthenticateMiddleware: OptionalAuthenticateMiddleware;

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.JwtService) private readonly jwtService: JwtService,
  ) {
    super(logger);
    this.logger.info('Register routes for OfferController…');

    this.authenticateMiddleware = new AuthenticateMiddleware(this.jwtService);
    this.optionalAuthenticateMiddleware = new OptionalAuthenticateMiddleware(this.jwtService);

    const validateOfferIdMiddleware = new ValidateObjectIdMiddleware('offerId');
    const validateCreateOfferDtoMiddleware = new ValidateDtoMiddleware(CreateOfferDto);
    const validateUpdateOfferDtoMiddleware = new ValidateDtoMiddleware(UpdateOfferDto);
    const documentExistsMiddleware = new DocumentExistsMiddleware(this.offerService, 'offerId', 'Offer');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index as any, middlewares: [this.optionalAuthenticateMiddleware] });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create as any,
      middlewares: [this.authenticateMiddleware, validateCreateOfferDtoMiddleware]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show as any,
      middlewares: [this.optionalAuthenticateMiddleware, validateOfferIdMiddleware, documentExistsMiddleware]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update as any,
      middlewares: [this.authenticateMiddleware, validateOfferIdMiddleware, validateUpdateOfferDtoMiddleware, documentExistsMiddleware]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete as any,
      middlewares: [this.authenticateMiddleware, validateOfferIdMiddleware, documentExistsMiddleware]
    });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremiumByCity as any, middlewares: [this.optionalAuthenticateMiddleware] });
  }

  public async index(req: Request & { user?: { id: string } }, res: Response): Promise<void> {
    const userId = req.user?.id;
    this.logger.info(`OfferController.index userId=${userId}`);
    const offers = await this.offerService.find(undefined, userId);
    this.ok(res, offers);
  }

  public async show(
    { params, user }: Request<{ offerId: string }> & { user?: { id: string } },
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const userId = user?.id;
    const offer = await this.offerService.findById(offerId, userId);
    this.ok(res, offer);
  }

  public async create(
    { body, user }: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto> & { user?: { id: string } },
    res: Response,
  ): Promise<void> {
    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'User not authenticated',
        'OfferController'
      );
    }
    const result = await this.offerService.create({ ...body, userId: user.id } as CreateOfferDto & { userId: string });
    this.created(res, result);
  }

  public async update(
    { body, params, user }: Request<{ offerId: string }, Record<string, unknown>, UpdateOfferDto> & { user?: { id: string } },
    res: Response,
  ): Promise<void> {
    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'User not authenticated',
        'OfferController'
      );
    }

    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found`,
        'OfferController'
      );
    }

    let offerUserId: string;
    if (typeof offer.user === 'object' && offer.user !== null) {
      offerUserId = (offer.user as any)._id ? (offer.user as any)._id : (offer.user as any).id;
    } else {
      offerUserId = offer.user as unknown as string;
    }

    if (offerUserId.toString() !== user.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'You can only edit your own offers',
        'OfferController'
      );
    }

    const updatedOffer = await this.offerService.updateById(offerId, body);
    this.ok(res, updatedOffer);
  }

  public async delete(
    { params, user }: Request<{ offerId: string }> & { user?: { id: string } },
    res: Response
  ): Promise<void> {
    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'User not authenticated',
        'OfferController'
      );
    }

    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found`,
        'OfferController'
      );
    }

    let offerUserId: string;
    if (typeof offer.user === 'object' && offer.user !== null) {
      offerUserId = (offer.user as any)._id ? (offer.user as any)._id : (offer.user as any).id;
    } else {
      offerUserId = offer.user as unknown as string;
    }

    if (offerUserId.toString() !== user.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'You can only delete your own offers',
        'OfferController'
      );
    }

    await this.offerService.deleteById(offerId);
    this.noContent(res, null);
  }

  public async getPremiumByCity(
    { params, user }: Request & { user?: { id: string } },
    res: Response
  ): Promise<void> {
    const { city } = params;
    const userId = user?.id;
    const offers = await this.offerService.findPremiumByCity(city as any, userId);
    this.ok(res, offers);
  }
}
