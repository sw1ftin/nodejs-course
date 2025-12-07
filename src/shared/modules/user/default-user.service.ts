import { inject, injectable } from 'inversify';
import { types } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserService } from './user-service.interface.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { createSHA256 } from '../../helpers/index.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<UserEntity> {
    const user = {
      name: dto.name,
      email: dto.email,
      avatarUrl: dto.avatarUrl,
      password: createSHA256(dto.password, salt),
      type: dto.type
    };

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userModel.findOne({ email }).exec();
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<UserEntity> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async findById(userId: string): Promise<UserEntity | null> {
    return this.userModel.findById(userId).exec();
  }

  public async updateById(userId: string, dto: UpdateUserDto): Promise<UserEntity | null> {
    return this.userModel.findByIdAndUpdate(userId, dto, { new: true }).exec();
  }

  public async addToFavorites(userId: string, offerId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { favorites: offerId }
    }).exec();
  }

  public async removeFromFavorites(userId: string, offerId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { favorites: offerId }
    }).exec();
  }

  public async findFavorites(userId: string): Promise<string[]> {
    const user = await this.userModel.findById(userId).select('favorites').exec();
    return user?.favorites || [];
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.userModel.exists({ _id: documentId })) !== null;
  }
}
