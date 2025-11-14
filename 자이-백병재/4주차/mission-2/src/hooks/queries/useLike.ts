import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEY } from '../../constants/key';
import { like } from '../../apis/lp';

export const useLike = (lpId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: like,      // .mutate시 실행할 함수
    
    // mutationFn이 성공 이후 실행할 작업
    onSuccess: () => {
      // queryKey에 해당하는 데이터를 오래된 데이터로 취급해서 다시 받아오게 한다.
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, lpId] ,
        exact: false,
      });
    },
    onError: (error) => {
      console.error('댓글 생성 실패:', error);
      alert("좋아요요에 실패했습니다.");
    },
  });
};