import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { CursorBasedResponse, PaginationDTO, ResponseLpDTO } from "../../types/lp";

export function useGetInfiniteLpList({
    limit,
    search,
    order,
    staleTime = 5 * 60 * 1000,
    gcTime = 10 * 60 * 1000,
}: PaginationDTO) {
    return useInfiniteQuery({
    queryKey:[QUERY_KEY.lps, search, order, limit],

    // pageParam을 cursor로 사용
    queryFn: ({ pageParam = 0 }) => { // initialPageParam이 0이므로 기본값도 0으로 설정
      return getLpList({ cursor: pageParam, limit, search, order });
    },

    // 첫 페이지의 커서
    initialPageParam: 0,

    getNextPageParam: (lastPage: CursorBasedResponse<ResponseLpDTO[]>) => {
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
    
    // staleTime, gcTime 등 기타 옵션
    staleTime: staleTime,
    gcTime: gcTime,
  });
}