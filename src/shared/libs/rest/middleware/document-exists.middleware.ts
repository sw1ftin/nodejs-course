import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';
import { DocumentExists } from '../../../types/index.js';

export class DocumentExistsMiddleware implements Middleware {
  constructor(
    private readonly service: DocumentExists,
    private readonly paramName: string,
    private readonly entityName: string
  ) {}

  public async execute({ params }: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = params[this.paramName];

    if (!documentId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `${this.paramName} is required`,
        'DocumentExistsMiddleware'
      );
    }

    const exists = await this.service.exists(documentId);

    if (!exists) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with id ${documentId} not found.`,
        'DocumentExistsMiddleware'
      );
    }

    next();
  }
}


