import { ApiProperty } from '@nestjs/swagger';
import { CommonResponse } from '../../common/dto/common-response.dto';

/**
 * 태그 정보 DTO
 */
export class TagResponseDto {
  @ApiProperty({ example: 1, description: '태그의 고유 식별자' })
  id: number;

  @ApiProperty({ example: 'typescript', description: '태그 이름' })
  name: string;
}

/**
 * 태그 목록 데이터 응답 DTO (페이지네이션 포함)
 */
export class TagListDataResponseDto {
  @ApiProperty({
    type: [TagResponseDto],
    description: '태그 목록',
  })
  data: TagResponseDto[];

  @ApiProperty({ example: 5, description: '다음 커서 (nextCursor)' })
  nextCursor: number;

  @ApiProperty({
    example: false,
    description: '추가 페이지 존재 여부 (hasNext)',
  })
  hasNext: boolean;
}

/**
 * 태그 목록 조회 응답 DTO
 */
export class TagListResponseDto extends CommonResponse<TagListDataResponseDto> {
  @ApiProperty({ type: TagListDataResponseDto, nullable: true })
  data: TagListDataResponseDto;
}
