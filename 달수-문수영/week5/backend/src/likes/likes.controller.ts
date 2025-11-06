import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Request,
  Query,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { ResponseMessage } from '../common/decorators/response-message-decorator';
import { LpListResponseDto } from '../lps/dto/lps-response.dto';
import { LikeResponseWrapperDto } from './dto/like-response.dto';
import { UnlikeResponseWrapperDto } from './dto/unlikie-response.dto';

@ApiTags('likes')
@ApiBearerAuth()
@Controller('lps')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  // 좋아요 추가 API
  // POST /v1/lps/:lpId/likes
  @ResponseMessage('게시글에 좋아요를 추가했습니다.')
  @Post(':lpId/likes')
  @ApiOperation({
    summary: '게시글 좋아요',
    description: '특정 게시글에 좋아요를 추가합니다.',
  })
  @ApiCreatedResponse({
    description: '좋아요 추가 성공',
    type: LikeResponseWrapperDto,
  })
  async likePost(
    @Param('lpId', ParseIntPipe) lpId: number,
    @Request() req: any,
  ) {
    const userId = req.user.id;

    return await this.likesService.likePost(userId, lpId);
  }

  // 좋아요 취소 API
  // DELETE /v1/lps/:lpId/likes
  @ResponseMessage('게시글에 좋아요를 취소했습니다.')
  @ApiOkResponse({
    description: '좋아요 취소 성공',
    type: UnlikeResponseWrapperDto,
  })
  @Delete(':lpId/likes')
  @ApiOperation({
    summary: '게시글 좋아요 취소',
    description: '특정 게시글에 좋아요를 취소합니다.',
  })
  async unlikePost(
    @Param('lpId', ParseIntPipe) lpId: number,
    @Request() req: any,
  ) {
    const userId = req.user.id;

    return await this.likesService.unlikePost(userId, lpId);
  }

  // 사용자가 좋아요한 게시글 목록 조회 API
  // GET /v1/lps/likes?userId=xxx
  @ResponseMessage('내가 좋아요 한 Lp 목록 조회에 성공했습니다.')
  @Get('likes/me')
  @ApiOperation({
    summary: '내가 좋아요한 Lp 목록 조회',
    description:
      '특정 유저가 좋아요한 Lp 목록을 조회합니다. 커서기반 페이지네이션 기능을 제공합니다. 기본값은 10개입니다.',
  })
  @ApiResponse({
    status: 200,
    description: '내가 좋아요 한 Lp 목록 조회 성공',
    type: LpListResponseDto,
  })
  async getLikedPosts(
    @Request() req: any,
    @Query() cursorPaginationDto: CursorPaginationDto,
  ) {
    const userId = req.user.id;

    return await this.likesService.getLikedPosts(
      Number(userId),
      cursorPaginationDto,
    );
  }

  @ResponseMessage('특정 유저가 좋아요 한 목록 조회에 성공했습니다.')
  @Get('likes/:userId')
  @ApiOperation({
    summary: '특정 유저가 좋아요한 Lp 목록 조회',
    description:
      '특정 유저가 좋아요한 Lp 목록을 조회합니다. 커서기반 페이지네이션 기능을 제공합니다. 기본값은 10개입니다.',
  })
  @ApiResponse({
    status: 200,
    description: '특정 유저가 좋아요 한 Lp 목록 조회 성공',
    type: LpListResponseDto,
  })
  async getUserLikedPosts(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() cursorPaginationDto: CursorPaginationDto,
  ) {
    return await this.likesService.getLikedPosts(
      Number(userId),
      cursorPaginationDto,
    );
  }
}
