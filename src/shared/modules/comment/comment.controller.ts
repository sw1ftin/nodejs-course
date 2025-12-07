import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  BaseController,
  HttpMethod,
  ValidateObjectIdMiddleware,
  ValidateDtoMiddleware,
  DocumentExistsMiddleware,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CommentService } from './comment-service.interface.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { OfferService } from '../offer/offer-service.interface.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService)
    private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);
    this.logger.info('Register routes for CommentController…');

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
      middlewares: [validateOfferIdMiddleware, validateCreateCommentDtoMiddleware, documentExistsMiddleware]
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
    }: Request<{ offerId: string }, Record<string, unknown>, CreateCommentDto>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;

    const result = await this.commentService.create({
      ...body,
      offerId,
    });
    this.created(res, result);
  }
}
