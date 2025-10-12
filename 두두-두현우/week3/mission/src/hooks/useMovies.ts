import type { MovieResponse } from "../types/movie";
import { TMDB_CONFIG } from "../config/api";
import { useTMDBRequest } from "./useTMDBRequest";

export const useMovies = (page: number = 1) => {
  const { data, loading, error } = useTMDBRequest<MovieResponse>(
    `${TMDB_CONFIG.API_URL}`,
    [page],
    {
      method: "GET",
      query: { language: TMDB_CONFIG.DEFAULT_LANGUAGE, page },
    }
  );

  return { movies: data, loading, error };
};
