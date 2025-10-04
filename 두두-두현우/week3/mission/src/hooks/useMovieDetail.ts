import { useState, useEffect } from "react";
import type { MovieDetail } from "../types/movie";
import { TMDB_CONFIG, API_HEADERS } from "../config/api";

export const useMovieDetail = (movieId: number) => {
  const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${TMDB_CONFIG.API_URL.replace("/popular", "")}/${movieId}?language=${
            TMDB_CONFIG.DEFAULT_LANGUAGE
          }&append_to_response=credits`,
          {
            method: "GET",
            headers: API_HEADERS,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: MovieDetail = await response.json();
        setMovieDetail(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching movie detail:", err);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovieDetail();
    }
  }, [movieId]);

  return { movieDetail, loading, error };
};

