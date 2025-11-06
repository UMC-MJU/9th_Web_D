import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInRequestDto {
  @ApiProperty({ example: 'dydals3440@gmail.com', description: '이메일' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Smu123!!', description: '비밀번호' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RefreshTokenRequestDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cC...',
    description: '리프레시 토큰',
  })
  @IsNotEmpty()
  @IsString()
  refresh: string;
}
