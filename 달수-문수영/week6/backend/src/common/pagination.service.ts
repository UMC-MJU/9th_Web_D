import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaginationService {
  constructor(private readonly prisma: PrismaService) {}

  async paginate(
    model: keyof PrismaService, // Prisma 모델을 안전하게 받음
    cursorField: string, // 커서 필드 (예: id)
    paginationDto: {
      cursor?: string | number;
      limit?: string | number;
      order?: 'asc' | 'desc'; // 정렬 순서 추가
      search?: string; // 검색 기능 추가
      extraWhere?: Record<string, any>; // 추가 필터 조건 (예: 특정 userId 등)
      include?: Record<string, any>; // 관계를 포함할 옵션
    },
  ): Promise<{
    data: any[];
    nextCursor: string | number | null;
    hasNext: boolean;
  }> {
    // limit과 cursor를 숫자로 변환
    const limitValue =
      typeof paginationDto.limit === 'string'
        ? parseInt(paginationDto.limit, 10)
        : (paginationDto.limit ?? 10);
    const cursorValue =
      typeof paginationDto.cursor === 'string'
        ? parseInt(paginationDto.cursor, 10)
        : paginationDto.cursor;

    // order 값에 따라 정렬 방향과 커서 비교 연산자 결정
    const orderDirection = paginationDto.order === 'desc' ? 'desc' : 'asc';
    const cursorOperator = orderDirection === 'desc' ? 'lt' : 'gt';

    // 커서 조건 추가 (cursor가 제공된 경우)
    // 단, 내림차순(order=desc)이고 cursor가 0인 경우는 조건에서 제외하여 전체 최신 데이터를 조회하도록 함
    const cursorCondition =
      cursorValue !== undefined &&
      !(orderDirection === 'desc' && cursorValue === 0)
        ? { [cursorField]: { [cursorOperator]: cursorValue } }
        : {};

    // PrismaService에 해당 모델이 존재하는지 확인
    if (!(model in this.prisma)) {
      throw new Error(`Invalid model: ${String(model)}`);
    }
    const prismaModel = this.prisma[model] as any;

    // 모델별 검색 가능한 필드 정의
    const searchableFields: Record<string, string[]> = {
      lp: ['title'],
      tag: ['name'],
    };

    const searchFields = searchableFields[String(model)] || [];

    // 검색 조건 추가 (해당 모델의 필드에서 검색)
    const searchCondition =
      searchFields.length && paginationDto.search
        ? {
            OR: searchFields.map((field) => ({
              [field]: { contains: paginationDto.search },
            })),
          }
        : {};

    // 모든 조건 병합
    const finalWhere = {
      ...searchCondition,
      ...cursorCondition,
      ...paginationDto.extraWhere,
    };

    try {
      const results = await prismaModel.findMany({
        where: finalWhere, // 동적으로 where 조건 추가
        take: limitValue + 1, // hasNext 확인을 위해 limit+1개 조회
        orderBy: { [cursorField]: orderDirection },
        include: paginationDto.include, // 관계 옵션 전달
      });

      const hasNext = results.length > limitValue;
      if (hasNext) {
        results.pop();
      }

      return {
        data: results,
        nextCursor: results.length
          ? results[results.length - 1][cursorField]
          : null,
        hasNext,
      };
    } catch (error) {
      console.error('Prisma findMany error:', error);
      throw new Error('Database query failed');
    }
  }
}
