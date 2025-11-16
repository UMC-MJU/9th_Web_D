import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment, fixComment } from '../../apis/comment';
import { QUERY_KEY } from '../../constants/key';

export const useFixComment = (lpId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fixComment,      // .mutate시 실행할 함수
    
    // mutationFn이 성공 이후 실행할 작업
    onSuccess: () => {
      // queryKey에 해당하는 데이터를 오래된 데이터로 취급해서 다시 받아오게 한다.
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, lpId] 
      });
    },
    onError: (error) => {
      console.error('댓글 수정 실패:', error);
      alert("댓글 수정에 실패했습니다.");
    },
  });
};

export const useDeleteComment = (lpId: number) => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: deleteComment,      // .mutate시 실행할 함수
      
      // mutationFn이 성공 이후 실행할 작업
      onSuccess: () => {
        // queryKey에 해당하는 데이터를 오래된 데이터로 취급해서 다시 받아오게 한다.
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.lps, lpId] 
        });
      },
      onError: (error) => {
        console.error('댓글 삭제 실패:', error);
        alert("댓글 삭제제에 실패했습니다.");
      },
    });
  };