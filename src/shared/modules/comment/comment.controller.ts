import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  BaseController,
  HttpMethod,
  ValidateObjectIdMiddleware,
  ValidateDtoMiddleware,
  DocumentExistsMiddleware,
  AuthenticateMiddleware,
  HttpError,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CommentService } from './comment-service.interface.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { OfferService } from '../offer/offer-service.interface.js';
import { JwtService } from '../../libs/jwt/index.js';

@injectable()
export class CommentController extends BaseController {
  private readonly authenticateMiddleware: AuthenticateMiddleware;

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService)
    private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.JwtService) private readonly jwtService: JwtService,
  ) {
    super(logger);
    this.logger.info('Register routes for CommentController…');

    this.authenticateMiddleware = new AuthenticateMiddleware(this.jwtService);

    const validateOfferIdMiddleware = new ValidateObjectIdMiddleware('offerId');
    const validateCreateCommentDtoMiddleware = new ValidateDtoMiddleware(CreateCommentDto);
    const documentExistsMiddleware = new DocumentExistsMiddleware(this.offerService, 'offerId', 'Offer');

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.index as any,
      middlewares: [validateOfferIdMiddleware]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create as any,
      middlewares: [this.authenticateMiddleware, validateOfferIdMiddleware, validateCreateCommentDtoMiddleware, documentExistsMiddleware]
    });
  }

  public async index(
    { params }: Request<{ offerId: string }>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;
    const comments = await this.commentService.findByOfferId(offerId);
    this.ok(res, comments);
  }

  public async create(
    {
      body,
      params,
      user,
    }: Request<{ offerId: string }, Record<string, unknown>, CreateCommentDto> & { user?: { id: string } },
    res: Response,
  ): Promise<void> {
    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'User not authenticated',
        'CommentController'
      );
    }

    const { offerId } = params;

    const result = await this.commentService.create({
      ...body,
      offerId,
      authorId: user.id,
    });
    this.created(res, result);
  }
}
