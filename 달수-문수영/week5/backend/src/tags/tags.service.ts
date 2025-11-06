import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationService } from '../common/pagination.service';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';

@Injectable()
export class TagsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pagination: PaginationService,
  ) {}

  async findAll(cursorPaginationDto: CursorPaginationDto) {
    return await this.pagination.paginate('tag', 'id', {
      ...cursorPaginationDto,
    });
  }
}
