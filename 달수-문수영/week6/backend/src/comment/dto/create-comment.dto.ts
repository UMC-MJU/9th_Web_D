import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: '생성할 댓글의 내용',
    example: '댓글 내용입니다.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class UpdateCommentDto {
  @ApiProperty({
    example: '수정된 댓글 내용입니다.',
    description: '수정할 댓글의 내용',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
