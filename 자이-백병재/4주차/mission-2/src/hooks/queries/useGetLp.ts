import { useQuery } from "@tanstack/react-query";
import type { PaginationDTO } from "../../types/lp";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLp({ cursor, search, order, limit }: PaginationDTO) {
    return useQuery({
        queryKey:[QUERY_KEY, search, order, limit],
        queryFn: () => getLpList({
            cursor, search, order, limit
        }),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 3,
    });
}

export default useGetLp;