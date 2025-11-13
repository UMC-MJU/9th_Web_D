import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: '오타니안',
    description: '유저 이름',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: '안녕하세요. 저는 오타니아닌데요?.',
    description: '자기소개',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    example: 'https://avatars.githubusercontent.com/u/55682610?v=4',
    description: '프로필 이미지 URL',
  })
  @IsOptional()
  @IsString()
  avatar?: string;
}
