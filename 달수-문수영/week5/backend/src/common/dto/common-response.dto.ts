import { ApiProperty } from '@nestjs/swagger';

export class CommonResponse<T> {
  @ApiProperty({
    example: true,
    description: '요청 성공 여부',
  })
  status: boolean;

  @ApiProperty({
    example: 201,
    description: 'HTTP 상태 코드',
  })
  statusCode: number;

  @ApiProperty({
    example: '요청이 성공했습니다.',
    description: '응답 메시지',
  })
  message: string;

  @ApiProperty({ description: '응답 데이터', nullable: true })
  data?: T;

  constructor(status: boolean, statusCode: number, message: string, data?: T) {
    this.status = status;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  /**
   * 성공 응답 생성
   * @param data 응답 데이터
   * @param statusCode HTTP 상태 코드 (기본값: 200)
   * @param message 응답 메시지 (기본값: 'Success')
   */
  static success<T>(data: T, statusCode = 200, message = 'Success') {
    return new CommonResponse<T>(true, statusCode, message, data);
  }

  /**
   * 에러 응답 생성
   * @param message 오류 메시지 (기본값: 'Error')
   * @param statusCode HTTP 상태 코드 (기본값: 400)
   * @param data 추가 오류 데이터 (선택적)
   */
  static error(message = 'Error', statusCode = 400, data?: any) {
    return new CommonResponse(false, statusCode, message, data);
  }
}
