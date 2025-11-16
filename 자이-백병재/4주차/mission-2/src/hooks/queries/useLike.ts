import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEY } from '../../constants/key';
import { disLike, like } from '../../apis/lp';
import type { Likes, ResponseLpDTO } from '../../types/lp';
import type { ResponseMyInfoDto } from '../../types/auth';

export const useLike = (lpId: number) => {
  const queryClient = useQueryClient();
  

  const queryKey = [QUERY_KEY.lps, lpId];

  return useMutation({
    mutationFn: () => like(lpId),

    onMutate: async () => {
      //  쿼리 취소
      await queryClient.cancelQueries({ queryKey });

      // 정보 가져오기
      const prevLp = queryClient.getQueryData<ResponseLpDTO>(queryKey);
      const me = queryClient.getQueryData<ResponseMyInfoDto>([QUERY_KEY.myInfo]);

      const userId = Number(me?.data.id);
      
      // 새 객체 생성
      const newLike = { userId, lpId } as Likes;
      const newLp = {
        ...prevLp,
        data: {
          ...prevLp?.data,
          likes: [...prevLp.data.likes, newLike],
        },
      };

      // 기존 데이터 엎어쓰기
      queryClient.setQueryData(queryKey, newLp);

      return { prevLp };
    },

    // 오류 시 롤백 (variables: mutate의 파라매터 / context: onMutate가 롤백한 값)
    onError: (error, variables, context) => {
      console.error('좋아요 실패:', error);
      if (context?.prevLp) {
        queryClient.setQueryData(queryKey, context.prevLp);
      }
    },

    // 완료 시 동기화
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};


export const useDisLike = (lpId: number) => {
  const queryClient = useQueryClient();
  

  const queryKey = [QUERY_KEY.lps, lpId];

  return useMutation({
    mutationFn: () => disLike(lpId),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const prevLp = queryClient.getQueryData<ResponseLpDTO>(queryKey);
      const me = queryClient.getQueryData<ResponseMyInfoDto>([QUERY_KEY.myInfo]);

      if (!prevLp || !me?.data?.id) {
        console.error('!!! [DisLike] 상세 캐시 또는 me 캐시가 없습니다.');
        return;
      }
      
      const userId = Number(me.data.id);

      const newLp = {
        ...prevLp,
        data: {
          ...prevLp.data,
          likes: prevLp.data.likes.filter(
            (like) => Number(like.userId) !== userId
          ),
        },
      };

      queryClient.setQueryData(queryKey, newLp);

      return { prevLp };
    },

    onError: (error, variables, context) => {
      console.error('좋아요 해제 실패:', error);
      if (context?.prevLp) {
        queryClient.setQueryData(queryKey, context.prevLp);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};