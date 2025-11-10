import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommonResponse } from '../../common/dto/common-response.dto';
import { IsIn, IsOptional, IsString } from 'class-validator';

/**
 * 작성자 정보 DTO
 */
export class AuthorResponseDto {
  @ApiProperty({ example: 4, description: '작성자의 고유 식별자' })
  id: number;

  @ApiProperty({ example: '매튜', description: '작성자의 이름' })
  name: string;

  @ApiProperty({
    example: 'dydals34404@gmail.com',
    description: '작성자의 이메일',
  })
  email: string;

  @ApiProperty({ example: null, description: '작성자의 소개 (Bio)' })
  bio: string | null;

  @ApiProperty({ example: null, description: '작성자의 아바타 URL' })
  avatar: string | null;

  @ApiProperty({
    example: '2025-02-22T13:38:53.339Z',
    description: '작성자 생성 일자',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-02-22T13:38:53.339Z',
    description: '작성자 수정 일자',
  })
  updatedAt: Date;
}

/**
 * 댓글 정보 DTO (개별 댓글 항목)
 */
export class CommentResponseDto {
  @ApiProperty({ example: 1, description: '댓글의 고유 식별자' })
  id: number;

  @ApiProperty({
    example: 'Solio delicate timor mollitia caelum aegrotatio conicio.',
    description: '댓글 내용',
  })
  content: string;

  @ApiProperty({ example: 1, description: '해당 댓글이 속한 LP의 고유 식별자' })
  lpId: number;

  @ApiProperty({ example: 4, description: '작성자 고유 식별자' })
  authorId: number;

  @ApiProperty({
    example: '2025-02-22T13:49:29.037Z',
    description: '댓글 생성 일자',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-02-22T13:49:29.037Z',
    description: '댓글 수정 일자',
  })
  updatedAt: Date;

  @ApiProperty({
    type: AuthorResponseDto,
    description: '작성자 정보 (민감한 정보 제외)',
  })
  author: AuthorResponseDto;
}

// 댓글 삭제
export class DeleteCommentResponseDto {
  @ApiProperty({
    example: '댓글이 삭제되었습니다.',
    description: '삭제 결과 메시지',
  })
  message: string;
}

/**
 * 댓글 목록 데이터 응답 DTO (페이징 포함)
 */
export class CommentListDataResponseDto {
  @ApiProperty({
    type: [CommentResponseDto],
    description: '댓글 목록',
  })
  data: CommentResponseDto[];

  @ApiProperty({ example: 10, description: '다음 커서 (nextCursor)' })
  nextCursor: number;

  @ApiProperty({
    example: true,
    description: '추가 페이지 존재 여부 (hasNext)',
  })
  hasNext: boolean;
}

/**
 * 댓글 목록 조회 응답 DTO
 */
export class CommentListResponseDto extends CommonResponse<CommentListDataResponseDto> {
  @ApiProperty({ type: CommentListDataResponseDto, nullable: true })
  data: CommentListDataResponseDto;
}

/**
 * 댓글 조회 응답 DTO
 */
export class CommentResponse extends CommonResponse<CommentResponseDto> {
  @ApiProperty({ type: CommentResponseDto, nullable: true })
  data: CommentResponseDto;
}

/**
 * 댓글 삭제 응답 DTO
 */

export class DeleteCommentResponse extends CommonResponse<DeleteCommentResponseDto> {
  @ApiProperty({ type: DeleteCommentResponseDto, nullable: true })
  data: DeleteCommentResponseDto;
}

/**
 * 댓글 목록 조회를 위한 쿼리 파라미터 DTO
 * - cursor: 페이지 시작 커서 값
 * - limit: 한 페이지에 보여줄 댓글 수 (리밋)
 */
export class GetCommentsQueryDto {
  @ApiPropertyOptional({ example: 0, description: '페이지 시작 커서 값' })
  cursor?: number;

  @ApiPropertyOptional({
    example: 10,
    description: '한 페이지에 보여줄 댓글 수 (리밋)',
  })
  limit?: number;

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
