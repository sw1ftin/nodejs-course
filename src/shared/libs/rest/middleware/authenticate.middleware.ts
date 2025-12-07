import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';
import { JwtService } from '../../jwt/index.js';
import { Component } from '../../../types/index.js';
import { inject, injectable } from 'inversify';

@injectable()
export class AuthenticateMiddleware implements Middleware {
  constructor(
    @inject(Component.JwtService) private readonly jwtService: JwtService
  ) {}

  public async execute(req: Request & { user?: { id: string; email: string } }, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Authorization header is required',
        'AuthenticateMiddleware'
      );
    }

    const [bearer, token] = authorizationHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid authorization header format',
        'AuthenticateMiddleware'
      );
    }

    try {
      const payload = await this.jwtService.verify(token);
      req.user = {
        id: payload.id,
        email: payload.email,
      };
      next();
    } catch (error) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid token',
        'AuthenticateMiddleware'
      );
    }
  }
}


