import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<UserEntity>;
  findById(userId: string): Promise<UserEntity | null>;
  updateById(userId: string, dto: UpdateUserDto): Promise<UserEntity | null>;
  addToFavorites(userId: string, offerId: string): Promise<void>;
  removeFromFavorites(userId: string, offerId: string): Promise<void>;
  findFavorites(userId: string): Promise<string[]>;
}
