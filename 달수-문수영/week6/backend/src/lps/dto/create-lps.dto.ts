import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateLpsDto {
  @ApiProperty({
    description: 'LP의 제목',
    example: 'NestJS로 배우는 타입스크립트',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'LP의 내용',
    example:
      '이 LP는 NestJS와 함께 타입스크립트의 기초와 고급 주제를 다룹니다.',
  })
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: '썸네일 이미지 URL (선택 사항)',
    example: 'https://example.com/thumbnail.png',
  })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiProperty({
    description: 'LP와 관련된 태그 목록',
    example: ['typescript', 'nestjs', 'programming'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty() // ✅ 생성 시에는 빈 배열을 허용하지 않음
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({
    description: 'LP가 게시되었는지 여부',
    example: true,
  })
  @IsBoolean()
  published: boolean;
}
