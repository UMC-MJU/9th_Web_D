import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: '매튜',
    description: '이름',
  })
  @IsString()
  name: string;

  @ApiProperty({ example: 'dydals3440@gmail.com', description: '이메일' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '안녕하세요. 저는 매튜입니다.',
    description: '자기소개',
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({
    example: 'https://avatars.githubusercontent.com/u/55682610?v=4',
    description: '프로필 이미지',
  })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ example: 'Smu123!!', description: '비밀번호' })
  @IsString()
  @IsOptional()
  password: string;
}
