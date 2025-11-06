import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message-decorator';
import { CursorPaginationDto } from 'src/common/dto/cursor-pagination.dto';
import { CreateLpsDto } from 'src/lps/dto/create-lps.dto';
import { UpdateLpsDto } from 'src/lps/dto/update-lps.dto';
import { LpsService } from 'src/lps/lps.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  LpDetailResponseWrapperDto,
  LpListResponseDto,
} from './dto/lps-response.dto';
import { LpCreateResponseDto } from './dto/create-lps-response.dto';
import { LpUpdateResponseDto } from './dto/update-lps-response.dto';
import { LpDeleteResponseDto } from './dto/delete-lps-response.dto';

@ApiTags('lps')
@Controller('lps')
export class LpsController {
  constructor(private readonly lpsService: LpsService) {}

  @ResponseMessage('Lp 목록 조회에 성공했습니다.')
  @Get()
  @ApiOperation({
    summary: 'Lp 목록 조회',
    description:
      'Lp 목록을 조회합니다. 커서기반 페이지네이션 기능을 제공합니다. 기본값은 10개입니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lp 목록 조회 성공',
    type: LpListResponseDto,
  })
  @Public()
  async getLps(@Query() cursorPaginationDto: CursorPaginationDto) {
    return await this.lpsService.findAll(cursorPaginationDto);
  }

  @ResponseMessage('특정 유저가 생성한 Lp 목록 조회에 성공했습니다.')
  @Get('user/:userId')
  @ApiOperation({
    summary: '특정 유저가 생성한 Lp 목록 조회',
    description:
      '특정 유저가 생성한 Lp 목록을 조회합니다. 커서기반 페이지네이션 기능을 제공합니다. 기본값은 10개입니다.',
  })
  @ApiResponse({
    status: 200,
    description: '특정 유저의 Lp 목록 조회 성공',
    type: LpListResponseDto,
  })
  @Public()
  async getUserLps(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() cursorPaginationDto: CursorPaginationDto,
  ) {
    return await this.lpsService.findByUser({ cursorPaginationDto, userId });
  }

  @ResponseMessage('내가 생성한 Lp 목록 조회에 성공했습니다.')
  @Get('user')
  @ApiOperation({
    summary: '내가 생성한 Lp 목록 조회',
    description:
      '내가 생성한 Lp 목록을 조회합니다. 커서기반 페이지네이션 기능을 제공합니다. 기본값은 10개입니다.',
  })
  @ApiResponse({
    status: 200,
    description: "내가 생성한 Lp 목록 조회에 성공했습니다.'",
    type: LpListResponseDto,
  })
  @ApiBearerAuth()
  async getMyLps(
    @Request() req: any,
    @Query() cursorPaginationDto: CursorPaginationDto,
  ) {
    const userId = req.user.id;
    return await this.lpsService.findByUser({ cursorPaginationDto, userId });
  }

  @ResponseMessage('Lp 상세 조회에 성공했습니다.')
  @Get(':lpId')
  @ApiOperation({
    summary: 'Lp 상세 조회',
    description: '특정 Lp의 상세 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lp 상세 조회에 성공했습니다.',
    type: LpDetailResponseWrapperDto,
  })
  @Public()
  async getLp(@Param('lpId', ParseIntPipe) lpId: number) {
    return await this.lpsService.findOne(lpId);
  }

  @ApiBearerAuth()
  @ResponseMessage('Lp 생성에 성공했습니다.')
  @ApiOperation({
    summary: 'Lp 생성',
    description: '새로운 Lp를 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: 'Lp 생성 성공',
    type: LpCreateResponseDto,
  })
  @Post()
  async createLp(@Request() req: any, @Body() createLpsDto: CreateLpsDto) {
    const userId = req.user.id;
    return await this.lpsService.create({ userId, createLpsDto });
  }

  @ApiBearerAuth()
  @ResponseMessage('Lp 정보 업데이트에 성공했습니다.')
  @ApiOperation({
    summary: 'Lp 정보 업데이트',
    description: '특정 Lp의 정보를 업데이트합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lp 정보 업데이트 성공',
    type: LpUpdateResponseDto,
  })
  @Patch(':lpId')
  async updateLp(
    @Request() req: any,
    @Body() updateLpsDto: UpdateLpsDto,
    @Param('lpId', ParseIntPipe) lpId: number,
  ) {
    const userId = req.user.id;
    return await this.lpsService.update({ userId, lpId, updateLpsDto });
  }

  @ApiBearerAuth()
  @ResponseMessage('Lp 정보 삭제에 성공했습니다.')
  @ApiOperation({
    summary: 'Lp 삭제',
    description: '특정 Lp를 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lp 삭제 성공',
    type: LpDeleteResponseDto,
  })
  @Delete(':lpId')
  async deleteLp(
    @Request() req: any,
    @Param('lpId', ParseIntPipe) lpId: number,
  ) {
    const userId = req.user.id;
    return await this.lpsService.delete({ userId, lpId });
  }

  // 특정 태그에 관한 게시글 목록 조회
  @ResponseMessage('특정 태그 관련 Lp 목록 조회에 성공했습니다.')
  @Get('tag/:tagName')
  @ApiOperation({
    summary: '특정 태그 관련 Lp 목록 조회',
    description:
      '특정 태그를 가진 Lp 목록을 조회합니다. 커서 기반 페이지네이션 기능을 제공합니다. 기본값은 10개입니다.',
  })
  @ApiResponse({
    status: 200,
    description: '특정 태그 관련 Lp 목록 조회 성공',
    type: LpListResponseDto,
  })
  @Public()
  async getLpsByTag(
    @Param('tagName') tagName: string,
    @Query() cursorPaginationDto: CursorPaginationDto,
  ) {
    return await this.lpsService.findByTag({ tagName, cursorPaginationDto });
  }
}
