import movieAxios from "./axios";
import type { movieGetParams, movieGetResponse } from "../types/movie";

export const getMovie = async ({query, include_adult, language}: movieGetParams): Promise<movieGetResponse> => {

    const url = query ? "/search/movie" : "/movie/popular";

    const params: any = {
        include_adult,
        language,
    };

    if (query) {
        params.query = query;
    }

    const response = await movieAxios.get(url, { params });
    return response.data;
}