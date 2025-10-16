import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

export interface CommentService {
  create(dto: CreateCommentDto): Promise<CommentEntity>;
  findByOfferId(offerId: string, limit?: number): Promise<CommentEntity[]>;
  deleteByOfferId(offerId: string): Promise<number>;
}
