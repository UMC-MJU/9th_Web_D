import { ApiProperty } from '@nestjs/swagger';
import { CommonResponse } from '../../common/dto/common-response.dto';

export class LpDeleteResponseDto extends CommonResponse<boolean> {
  @ApiProperty({ example: true, description: '삭제 성공 여부' })
  data: boolean;
}
