import { useState, useEffect } from "react";
import type { MovieResponse } from "../types/movie";
import { TMDB_CONFIG, API_HEADERS } from "../config/api";

export const useMovies = (page: number = 1) => {
  const [movies, setMovies] = useState<MovieResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${TMDB_CONFIG.API_URL}?language=${TMDB_CONFIG.DEFAULT_LANGUAGE}&page=${page}`,
          {
            method: "GET",
            headers: API_HEADERS,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: MovieResponse = await response.json();
        setMovies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page]);

  return { movies, loading, error };
};
