import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, HttpError, HttpMethod, ValidateDtoMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { UserService } from './user-service.interface.js';
import { Config } from '../../libs/config/index.js';
import { RestSchema } from '../../libs/config/rest.schema.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    const validateCreateUserDtoMiddleware = new ValidateDtoMiddleware(CreateUserDto);
    const validateLoginUserDtoMiddleware = new ValidateDtoMiddleware(LoginUserDto);

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

    this.ok(res, {
      email: user.email,
      name: user.name,
    });
  }
}
