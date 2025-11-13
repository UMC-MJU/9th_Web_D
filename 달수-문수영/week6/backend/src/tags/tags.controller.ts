import { Controller, Get, Query } from '@nestjs/common';
import { TagsService } from './tags.service';
import { ResponseMessage } from '../common/decorators/response-message-decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { Public } from '../auth/decorators/public.decorator';
import { TagListResponseDto } from './dto/tag-response.dto';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Public()
  @ResponseMessage('태그 목록 조회에 성공했습니다.')
  @Get()
  @ApiOperation({
    summary: '태그 목록 조회',
    description: '태그 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '태그 목록 조회 성공',
    type: TagListResponseDto,
  })
  async getTags(@Query() cursorPaginationDto: CursorPaginationDto) {
    return await this.tagsService.findAll(cursorPaginationDto);
  }
}
