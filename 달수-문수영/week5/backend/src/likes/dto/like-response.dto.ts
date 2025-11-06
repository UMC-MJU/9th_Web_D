import { ApiProperty } from '@nestjs/swagger';
import { CommonResponse } from '../../common/dto/common-response.dto';

export class LikeResponseDto {
  @ApiProperty({ example: 10, description: '좋아요 ID' })
  id: number;

  @ApiProperty({ example: 3, description: '사용자 ID' })
  userId: number;

  @ApiProperty({ example: 21, description: 'LP 게시글 ID' })
  lpId: number;
}

export class LikeResponseWrapperDto extends CommonResponse<LikeResponseDto> {
  @ApiProperty({ type: LikeResponseDto, description: '좋아요 데이터' })
  data: LikeResponseDto;
}
