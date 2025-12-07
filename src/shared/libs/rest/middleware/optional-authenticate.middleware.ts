import { NextFunction, Request, Response } from 'express';
import { Middleware } from './middleware.interface.js';
import { JwtService } from '../../jwt/index.js';
import { Component } from '../../../types/index.js';
import { inject, injectable } from 'inversify';

@injectable()
export class OptionalAuthenticateMiddleware implements Middleware {
  constructor(
    @inject(Component.JwtService) private readonly jwtService: JwtService
  ) {}

  public async execute(req: Request & { user?: { id: string; email: string } }, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers.authorization;
    console.log(`OptionalAuthenticateMiddleware: authorizationHeader=${authorizationHeader}`);
    if (!authorizationHeader) {
      return next();
    }

    const [bearer, token] = authorizationHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      return next();
    }

    try {
      const payload = await this.jwtService.verify(token);
      console.log(`OptionalAuthenticateMiddleware: token valid, payload=${JSON.stringify(payload)}`);
      req.user = {
        id: payload.id,
        email: payload.email,
      };
    } catch (_error) {
      // invalid token - don't throw, just continue as anonymous
    }
    next();
  }
}
