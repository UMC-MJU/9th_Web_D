import { IsOptional, IsInt, IsString, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CursorPaginationDto {
  @ApiPropertyOptional({
    example: 0,
    description:
      '페이지 시작 커서 값 (정수). 값이 없으면 기본적으로 처음부터 조회합니다.',
  })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsInt()
  cursor?: number;

  @ApiPropertyOptional({
    example: 10,
    description: '한 페이지에 보여줄 항목 수 (기본값: 10)',
  })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsInt()
  limit?: number;

  @ApiPropertyOptional({
    description: '검색할 문자열',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    example: 'asc',
    description: '정렬 순서: "asc"는 오래된 순, "desc"는 최신순',
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'], {
    message: 'order 값은 "asc" 또는 "desc"만 허용됩니다.',
  })
  order?: 'asc' | 'desc';
}
