import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";

import type { 
    CommentParms, 
    CommentResponseDto 
} from "../../types/comment"; 
import { getCommentList } from "../../apis/comment";
import type { CursorBasedResponse } from "../../types/lp";


export function useGetInfiniteCommentList({
  lpId,
  limit,
  order,
}: Omit<CommentParms, 'cursor'>) { // 'search'는 CommentParms에 없으므로 제거한다?
  return useInfiniteQuery({
    
    queryKey: [QUERY_KEY.lps, lpId, order, limit],

    queryFn: ({ pageParam = 0 }) => {

      return getCommentList({ lpId, cursor: pageParam, limit, order });
    },

    initialPageParam: 0,

    getNextPageParam: (lastPage: CursorBasedResponse<CommentResponseDto[]>) => {
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
    
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}