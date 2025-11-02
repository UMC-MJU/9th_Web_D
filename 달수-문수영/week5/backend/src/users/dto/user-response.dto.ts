import { ApiProperty } from '@nestjs/swagger';
import { CommonResponse } from '../../common/dto/common-response.dto';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: '사용자 고유 식별자' })
  id: number;

  @ApiProperty({ example: '매튜', description: '사용자 이름' })
  name: string;

  @ApiProperty({
    example: 'dydals3440@gmail.com',
    description: '사용자 이메일',
  })
  email: string;

  @ApiProperty({
    example: null,
    nullable: true,
    description: '사용자 소개 (Optional)',
  })
  bio: string | null;

  @ApiProperty({
    example: null,
    nullable: true,
    description: '사용자 아바타 (Optional)',
  })
  avatar: string | null;

  @ApiProperty({
    example: '2025-02-22T12:57:28.416Z',
    description: '생성 일자',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-02-28T12:48:44.204Z',
    description: '최근 수정 일자',
  })
  updatedAt: Date;
}

export class UserMyInfoResponse extends CommonResponse<UserResponseDto> {
  @ApiProperty({ type: UserResponseDto, nullable: true })
  data: UserResponseDto;
}
