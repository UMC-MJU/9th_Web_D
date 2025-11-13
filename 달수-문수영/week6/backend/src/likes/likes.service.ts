import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { PaginationService } from '../common/pagination.service';

@Injectable()
export class LikesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pagination: PaginationService,
  ) {}

  // 특정 게시글에 좋아요 추가
  async likePost(userId: number, lpId: number) {
    // 이미 좋아요를 눌렀는지 확인
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_lpId: { userId, lpId },
      },
    });
    if (existingLike) {
      throw new ConflictException('이미 좋아요를 누른 게시글입니다.');
    }
    return await this.prisma.like.create({
      data: {
        userId,
        lpId,
      },
    });
  }

  // 특정 게시글의 좋아요 취소
  async unlikePost(userId: number, lpId: number) {
    // 좋아요가 존재하는지 확인
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_lpId: { userId, lpId },
      },
    });
    if (!existingLike) {
      throw new NotFoundException('좋아요가 존재하지 않습니다.');
    }
    return await this.prisma.like.delete({
      where: {
        userId_lpId: { userId, lpId },
      },
    });
  }

  // 특정 사용자가 좋아요한 게시글 목록 조회
  async getLikedPosts(
    userId: number,
    cursorPaginationDto: CursorPaginationDto,
  ) {
    console.log(userId);
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return await this.pagination.paginate('lp', 'id', {
      ...cursorPaginationDto,
      include: {
        tags: true,
        likes: true,
      },
      extraWhere: {
        likes: {
          some: { userId },
        },
      },
    });
  }
}
