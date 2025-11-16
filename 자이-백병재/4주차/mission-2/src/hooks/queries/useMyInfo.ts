import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEY } from '../../constants/key';
import { deleteMyInfo, fixMyInfo } from '../../apis/auth';
import { useAuth } from '../../contexts/AuthContext';
import type { FixMy, ResponseMyInfoDto } from '../../types/auth';

export const useFixMyInfo = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: fixMyInfo,
      
      onMutate: async (updatedInfo: FixMy) => {
        await queryClient.cancelQueries({ queryKey: [QUERY_KEY.myInfo] });
        const previousInfo = queryClient.getQueryData<ResponseMyInfoDto>([
          QUERY_KEY.myInfo,
        ]);

        if (previousInfo) {
          queryClient.setQueryData<ResponseMyInfoDto>(
            [QUERY_KEY.myInfo],
            {
              ...previousInfo,
              data: {
                ...previousInfo.data,
                ...updatedInfo,
              },
            }
          );
        }

        return { previousInfo };
      },

      onError: (error, variables, context) => {
        console.error('정보 수정 실패:', error);
        if (context?.previousInfo) {
          queryClient.setQueryData([QUERY_KEY.myInfo], context.previousInfo);
        }
        alert('정보 수정에 실패했습니다. 원래대로 되돌립니다.');
      },

      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.myInfo]
        });
      },
    });
  };

  export const useDeleteMyInfo = () => {
    const queryClient = useQueryClient();
    const { logout } = useAuth();
  
    return useMutation({
      mutationFn: deleteMyInfo,
      onSuccess: () => {
        logout();
        queryClient.clear();
      }
    });
  };