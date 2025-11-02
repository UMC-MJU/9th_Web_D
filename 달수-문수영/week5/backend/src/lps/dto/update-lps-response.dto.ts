import { ApiProperty } from '@nestjs/swagger';
import { CommonResponse } from '../../common/dto/common-response.dto';

export class TagResponseDto {
  @ApiProperty({ example: 3, description: '태그의 고유 식별자' })
  id: number;

  @ApiProperty({ example: 'typescript', description: '태그 이름' })
  name: string;
}

export class LpUpdateResponseDataDto {
  @ApiProperty({ example: 409, description: 'LP의 고유 식별자' })
  id: number;

  @ApiProperty({
    example: 'NestJS로 배우는 타입스크립트',
    description: 'LP 제목',
  })
  title: string;

  @ApiProperty({
    example:
      '이 LP는 NestJS와 함께 타입스크립트의 기초와 고급 주제를 다룹니다.',
    description: 'LP 내용',
  })
  content: string;

  @ApiProperty({
    example: 'https://example.com/thumbnail.png',
    description: 'LP 썸네일 URL',
  })
  thumbnail: string;

  @ApiProperty({ example: true, description: '발행 여부' })
  published: boolean;

  @ApiProperty({ example: 1, description: '작성자 ID' })
  authorId: number;

  @ApiProperty({
    example: '2025-03-01T10:07:23.087Z',
    description: '생성 일자',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-03-01T10:09:12.611Z',
    description: '수정 일자',
  })
  updatedAt: Date;

  @ApiProperty({ type: [TagResponseDto], description: '태그 목록' })
  tags: TagResponseDto[];
}

export class LpUpdateResponseDto extends CommonResponse<LpUpdateResponseDataDto> {
  @ApiProperty({ type: LpUpdateResponseDataDto })
  data: LpUpdateResponseDataDto;
}
