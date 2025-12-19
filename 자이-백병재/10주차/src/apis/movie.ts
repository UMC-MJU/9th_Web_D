import movieAxios from "./axios";
import type { movieGetParams, movieGetResponse } from "../types/movie";

export const getMovie = async ({ query, include_adult, language }: movieGetParams): Promise<movieGetResponse> => {
    const url = query ? "/search/movie" : "/movie/popular";

    const response = await movieAxios.get(url, {
        params: {
            include_adult,
            language,

            ...(query && { query }),
        },
    });

    return response.data;
};