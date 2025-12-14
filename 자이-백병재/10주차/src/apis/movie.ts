import movieAxios from "./axios";
import type { movieGetParms, movieGetResponse } from "../types/movie";


export const getMovie = async ({query, include_adult, language}: movieGetParms): Promise<movieGetResponse> => {
    const response = await movieAxios.get("/search/movie", {
        params: {
            query,
            include_adult,
            language,
        },
    });
    return response.data;
}