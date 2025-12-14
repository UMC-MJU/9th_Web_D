import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getMovie, type movieGetParams, type movieGetResponse } from '../apis/movie';

export const useGetMovie = (params: movieGetParams): UseQueryResult<movieGetResponse, Error> => {
    return useQuery({
        queryKey: ["movie", params.query, params.include_adult, params.language],
        queryFn: () => getMovie(params),
        enabled: true, 
    });
}