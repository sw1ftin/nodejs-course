import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, HttpError, HttpMethod, ValidateDtoMiddleware, UploadFileMiddleware, AuthenticateMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { UserService } from './user-service.interface.js';
import { Config } from '../../libs/config/index.js';
import { RestSchema } from '../../libs/config/rest.schema.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { JwtService } from '../../libs/jwt/index.js';

@injectable()
export class UserController extends BaseController {
  private readonly authenticateMiddleware: AuthenticateMiddleware;

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
    @inject(Component.JwtService) private readonly jwtService: JwtService,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.authenticateMiddleware = new AuthenticateMiddleware(this.jwtService);

    const validateCreateUserDtoMiddleware = new ValidateDtoMiddleware(CreateUserDto);
    const validateLoginUserDtoMiddleware = new ValidateDtoMiddleware(LoginUserDto);
    const uploadAvatarMiddleware = new UploadFileMiddleware(
      this.configService.get('UPLOAD_DIRECTORY'),
      'avatar'
    );

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create as any,
      middlewares: [validateCreateUserDtoMiddleware]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login as any,
      middlewares: [validateLoginUserDtoMiddleware]
    });
    this.addRoute({
      path: '/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar as any,
      middlewares: [this.authenticateMiddleware, uploadAvatarMiddleware]
    });
    this.addRoute({
      path: '/check',
      method: HttpMethod.Get,
      handler: this.checkToken as any,
      middlewares: [this.authenticateMiddleware]
    });
    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Post,
      handler: this.addToFavorites as any,
      middlewares: [this.authenticateMiddleware]
    });
    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Delete,
      handler: this.removeFromFavorites as any,
      middlewares: [this.authenticateMiddleware]
    });
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorites as any,
      middlewares: [this.authenticateMiddleware]
    });
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, {
      email: result.email,
      name: result.name,
    });
  }

  public async login(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    res: Response,
  ): Promise<void> {
    const user = await this.userService.findByEmail(body.email);

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        'UserController',
      );
    }

    if (!user.verifyPassword(body.password, this.configService.get('SALT'))) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `Incorrect password for user ${body.email}.`,
        'UserController',
      );
    }

    const token = await this.jwtService.sign({
      email: user.email,
      id: user.id,
    });

    this.ok(res, {
      email: user.email,
      name: user.name,
      token,
    });
  }

  public async uploadAvatar(
    { file, user }: Request & { user?: { id: string } },
    res: Response,
  ): Promise<void> {
    if (!file) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Avatar file is required',
        'UserController'
      );
    }

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'User not authenticated',
        'UserController'
      );
    }

    const avatarUrl = `/upload/${file.filename}`;
    const updatedUser = await this.userService.updateById(user.id, { avatarUrl });

    this.ok(res, {
      avatarUrl: updatedUser?.avatarUrl,
    });
  }

  public async checkToken(
    { user }: Request & { user?: { id: string; email: string } },
    res: Response,
  ): Promise<void> {
    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'User not authenticated',
        'UserController'
      );
    }

    const foundUser = await this.userService.findById(user.id);

    if (!foundUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'User not found',
        'UserController'
      );
    }

    this.ok(res, {
      email: foundUser.email,
      name: foundUser.name,
      avatarUrl: foundUser.avatarUrl,
      type: foundUser.type,
    });
  }

  public async addToFavorites(
    { params, user }: Request<{ offerId: string }> & { user?: { id: string } },
    res: Response,
  ): Promise<void> {
    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'User not authenticated',
        'UserController'
      );
    }

    const { offerId } = params;
    await this.userService.addToFavorites(user.id, offerId);
    this.noContent(res, null);
  }

  public async removeFromFavorites(
    { params, user }: Request<{ offerId: string }> & { user?: { id: string } },
    res: Response,
  ): Promise<void> {
    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'User not authenticated',
        'UserController'
      );
    }

    const { offerId } = params;
    await this.userService.removeFromFavorites(user.id, offerId);
    this.noContent(res, null);
  }

  public async getFavorites(
    { user }: Request & { user?: { id: string } },
    res: Response,
  ): Promise<void> {
    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'User not authenticated',
        'UserController'
      );
    }

    const favorites = await this.userService.findFavorites(user.id);
    this.ok(res, favorites);
  }
}
