import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getMovie, type movieGetParms, type movieGetResponse } from '../apis/movie';

export const useGetMovie = (params: movieGetParms): UseQueryResult<movieGetResponse, Error> => {
    return useQuery({
        // params가 바뀔 때마다 쿼리키가 달라져서 자동으로 재검색됨
        queryKey: ["movie", params.query, params.include_adult, params.language],
        queryFn: () => getMovie(params),
        enabled: true, // 항상 쿼리 활성화 (검색어 없으면 인기영화 뜸)
    });
}