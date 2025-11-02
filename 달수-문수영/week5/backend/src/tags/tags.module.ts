import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationService } from '../common/pagination.service';

@Module({
  controllers: [TagsController],
  providers: [TagsService, PrismaService, PaginationService],
})
export class TagsModule {}
