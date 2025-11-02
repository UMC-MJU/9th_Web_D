import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Request,
} from '@nestjs/common';
import { UserService } from './users.service';
import { ResponseMessage } from '../common/decorators/response-message-decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserMyInfoResponse } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @ResponseMessage('내 정보 조회에 성공했습니다.')
  @Get('/me')
  @ApiOperation({
    summary: '내 정보 조회',
    description: '로그인한 사용자의 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '내 정보 조회 성공',
    type: UserMyInfoResponse,
  })
  async getMyInfo(@Request() req: any) {
    const userId = req.user.id;

    return await this.usersService.getMyInfo(userId);
  }

  @ResponseMessage('다른 사용자 정보 조회에 성공했습니다.')
  @Get('/:userId')
  @ApiOperation({
    summary: '다른 사용자 정보 조회',
    description: '다른 사용자의 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '다른 사용자 정보 조회 성공',
    type: UserMyInfoResponse,
  })
  async getUserInfo(@Param('userId', ParseIntPipe) userId: number) {
    return await this.usersService.getMyInfo(userId);
  }

  @ResponseMessage('회원 탈퇴')
  @Delete()
  @ApiOperation({
    summary: '회원 탈퇴',
    description:
      '회원 탈퇴를 진행합니다. 회원 탈퇴 시, 모든 게시글, 댓글, 좋아요, 사용자의 정보가 삭제됩니다.',
  })
  @ApiResponse({
    status: 200,
    description: '회원 탈퇴 성공',
  })
  async deleteUser(@Request() req: any) {
    const userId = req.user.id;

    return await this.usersService.deleteUser(userId);
  }

  @ResponseMessage('유저 정보 수정')
  @Patch()
  @ApiOperation({
    summary: '유저 정보 수정',
    description: '유저 정보를 수정합니다.',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: '유저 정보가 성공적으로 수정되었습니다.',
    type: UserMyInfoResponse,
  })
  @ApiResponse({ status: 400, description: '잘못된 요청입니다.' })
  @ApiResponse({ status: 401, description: '인증에 실패했습니다.' })
  async updateUser(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.id;
    return await this.usersService.updateUser(userId, updateUserDto);
  }
}
