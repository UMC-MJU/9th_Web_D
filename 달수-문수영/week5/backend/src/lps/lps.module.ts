import { Module } from '@nestjs/common';
import { LpsService } from './lps.service';
import { LpsController } from './lps.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationService } from 'src/common/pagination.service';

@Module({
  providers: [LpsService, PrismaService, PaginationService],
  controllers: [LpsController],
})
export class LpModule {}
