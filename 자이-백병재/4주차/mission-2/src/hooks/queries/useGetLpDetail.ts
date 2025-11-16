import { useQuery } from "@tanstack/react-query"; 
import { getLpDetail } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLpDetail(lpId: number) {
    return useQuery({
        queryKey:[QUERY_KEY.lps, lpId], 
        queryFn: () => getLpDetail(lpId),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 3,
    });
}

export default useGetLpDetail;