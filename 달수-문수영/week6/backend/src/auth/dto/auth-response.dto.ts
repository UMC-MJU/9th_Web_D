import { ApiProperty } from '@nestjs/swagger';
import { CommonResponse } from '../../common/dto/common-response.dto';

export class SignUpResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '매튜' })
  name: string;

  @ApiProperty({ example: 'dydals3440@gmail.com' })
  email: string;

  @ApiProperty({ example: null, nullable: true })
  bio: string | null;

  @ApiProperty({ example: null, nullable: true })
  avatar: string | null;

  @ApiProperty({ example: '2025-02-25T12:06:28.927Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-02-25T12:06:28.927Z' })
  updatedAt: Date;
}

export class SignInResponseDto {
  @ApiProperty({ example: 20 })
  id: number;

  @ApiProperty({ example: '매튜' })
  name: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5c...' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5c...' })
  refreshToken: string;
}

export class SignUpResponse extends CommonResponse<SignUpResponseDto> {
  @ApiProperty({ type: SignUpResponseDto, nullable: true })
  data: SignUpResponseDto;
}

export class SignInResponse extends CommonResponse<SignInResponseDto> {
  @ApiProperty({ type: SignInResponseDto, nullable: true })
  data: SignInResponseDto;
}

export class SignOutResponse extends CommonResponse<null> {
  @ApiProperty({ example: null, nullable: true })
  data: null;
}
