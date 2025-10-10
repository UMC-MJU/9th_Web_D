import type { MovieDetail } from "../types/movie";
import { TMDB_CONFIG } from "../config/api";
import { useTMDBRequest } from "./useTMDBRequest";

export const useMovieDetail = (movieId: number) => {
  const baseUrl = `${TMDB_CONFIG.API_URL.replace("/popular", "")}/${movieId}`;
  const { data, loading, error } = useTMDBRequest<MovieDetail>(
    baseUrl,
    [movieId],
    {
      method: "GET",
      query: {
        language: TMDB_CONFIG.DEFAULT_LANGUAGE,
        append_to_response: "credits",
      },
      enabled: Boolean(movieId),
    }
  );

  return { movieDetail: data, loading, error };
};
