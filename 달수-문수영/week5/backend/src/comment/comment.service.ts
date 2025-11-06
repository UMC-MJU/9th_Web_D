import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationService } from '../common/pagination.service';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { CreateCommentDto, UpdateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pagination: PaginationService,
  ) {}

  async findAll(
    lpId: number,
    cursorPaginationDto: Omit<CursorPaginationDto, 'search'>,
  ) {
    const post = await this.prisma.lp.findUnique({
      where: { id: lpId },
    });
    if (!post) {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');
    }

    return await this.pagination.paginate('comment', 'id', {
      ...cursorPaginationDto,
      extraWhere: { lpId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            bio: true,
            avatar: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  async create({
    lpId,
    userId,
    createCommentDto,
  }: {
    lpId: number;
    userId: number;
    createCommentDto: CreateCommentDto;
  }) {
    // LP(게시글)가 존재하는지 확인
    const lp = await this.prisma.lp.findUnique({ where: { id: lpId } });

    if (!lp) {
      throw new NotFoundException('해당 게시글이 존재하지 않습니다.');
    }

    return await this.prisma.comment.create({
      data: {
        ...createCommentDto,
        author: {
          connect: {
            id: userId,
          },
        },
        lp: {
          connect: {
            id: lpId,
          },
        },
      },
    });
  }

  // 댓글 수정 (본인이 작성한 댓글만 수정 가능)
  async update({
    commentId,
    lpId,
    userId,
    updateCommentDto,
  }: {
    commentId: number;
    lpId: number;
    userId: number;
    updateCommentDto: UpdateCommentDto;
  }) {
    // 댓글 존재 여부 및 LP 소속 확인
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment || comment.lpId !== lpId) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }
    // 본인이 작성한 댓글인지 검증
    if (comment.authorId !== userId) {
      throw new ForbiddenException('본인이 작성한 댓글만 수정할 수 있습니다.');
    }

    return await this.prisma.comment.update({
      where: { id: commentId },
      data: {
        content: updateCommentDto.content, // 업데이트할 필드 명시
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            bio: true,
            avatar: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  // 댓글 삭제 (본인이 작성한 댓글만 삭제 가능)
  async delete({
    commentId,
    lpId,
    userId,
  }: {
    commentId: number;
    lpId: number;
    userId: number;
  }) {
    // 댓글 존재 여부 및 LP 소속 확인
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment || comment.lpId !== lpId) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }
    // 본인이 작성한 댓글인지 검증
    if (comment.authorId !== userId) {
      throw new ForbiddenException('본인이 작성한 댓글만 삭제할 수 있습니다.');
    }
    await this.prisma.comment.delete({
      where: { id: commentId },
    });
    return { message: '댓글이 삭제되었습니다.' };
  }
}
