import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEY } from '../../constants/key';
import { deleteMyInfo, fixMyInfo } from '../../apis/auth';
import { useAuth } from '../../contexts/AuthContext';

export const useFixMyInfo = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: fixMyInfo,      // .mutate시 실행할 함수
      
      // mutationFn이 성공 이후 실행할 작업
      onSuccess: () => {
        // queryKey에 해당하는 데이터를 오래된 데이터로 취급해서 다시 받아오게 한다.
        queryClient.invalidateQueries({
          queryKey: QUERY_KEY.myInfo
        });
      }
    });
  };

  export const useDeleteMyInfo = () => {
    const queryClient = useQueryClient();
    const { logout } = useAuth();
  
    return useMutation({
      mutationFn: deleteMyInfo,     // .mutate시 실행할 함수
      
      // mutationFn이 성공 이후 실행할 작업
      onSuccess: () => {
        logout();
        queryClient.clear();
      }
    });
  };