import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getMovie } from '../apis/movie';
import type { movieGetResponse } from '../types/movie';

export const useGetMovie = ():UseQueryResult<movieGetResponse, Error> => {

    return useQuery({
        queryKey: ["movie"],
        queryFn: () => getMovie({query: "주토피아", include_adult: false, language: "ko-KR"}),
    });

}