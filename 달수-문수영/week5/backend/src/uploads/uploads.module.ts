import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { MulterModule } from '@nestjs/platform-express';
import { storage } from './utils/file-upload.utils';

@Module({
  imports: [MulterModule.register({ storage })],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
