import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseMessage } from '../common/decorators/response-message-decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @ResponseMessage('이미지 업로드 성공')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: '이미지 업로드(인증)',
    description:
      '이미지 업로드 성공 시 URL을 반환 받습니다. 이미지 필드를 요구하는 곳에 해당 URL을 첨부하시면 됩니다. ex) Lp생성(POST /v1/lps)의 thumbnail 필드에 이미지 업로드 성공 후 반환되는 imageUrl을 첨부하시면 됩니다.',
  })
  @ApiConsumes('multipart/form-data') // FormData 형식 사용
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary', // 파일 업로드 필드
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '이미지 업로드 성공.',
    schema: {
      example: {
        status: true,
        message: '이미지 업로드 성공.',
        statusCode: 201,
        data: {
          imageUrl: 'http://localhost:8000/uploads/1741127947806-552079898.png',
        },
      },
    },
  })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { imageUrl: this.uploadsService.getImageUrl(file.filename) };
  }

  @Post('public')
  @Public()
  @ResponseMessage('이미지 업로드 성공')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '이미지 업로드(비인증)',
    description:
      '이미지 업로드 성공 시 URL을 반환 받습니다. 이미지 필드를 요구하는 곳에 해당 URL을 첨부하시면 됩니다. ex) Lp생성(POST /v1/lps)의 thumbnail 필드에 이미지 업로드 성공 후 반환되는 imageUrl을 첨부하시면 됩니다.',
  })
  @ApiConsumes('multipart/form-data') // FormData 형식 사용
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary', // 파일 업로드 필드
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '이미지 업로드 성공.',
    schema: {
      example: {
        status: true,
        message: '이미지 업로드 성공.',
        statusCode: 201,
        data: {
          imageUrl: 'http://localhost:8000/uploads/1741127947806-552079898.png',
        },
      },
    },
  })
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return { imageUrl: this.uploadsService.getImageUrl(file.filename) };
  }
}
