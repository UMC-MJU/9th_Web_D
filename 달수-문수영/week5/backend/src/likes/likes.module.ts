import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationService } from '../common/pagination.service';

@Module({
  controllers: [LikesController],
  providers: [LikesService, PrismaService, PaginationService],
})
export class LikesModule {}
