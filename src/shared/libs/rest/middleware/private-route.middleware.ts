import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';
import { JwtService } from '../../jwt/index.js';

export class PrivateRouteMiddleware implements Middleware {
  constructor(private readonly jwtService: JwtService) {}

  public async execute(req: Request & { user?: { id: string; email: string } }, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Authorization required',
        'PrivateRouteMiddleware'
      );
    }

    const [bearer, token] = authorizationHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid authorization format',
        'PrivateRouteMiddleware'
      );
    }

    try {
      const payload = await this.jwtService.verify(token);
      req.user = {
        id: payload.id,
        email: payload.email,
      };
      next();
    } catch {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid or expired token',
        'PrivateRouteMiddleware'
      );
    }
  }
}
