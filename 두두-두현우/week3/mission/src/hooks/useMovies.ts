import { useState, useEffect } from "react";
import type { MovieResponse } from "../types/movie";

const TMDB_API_URL = "https://api.themoviedb.org/3/movie/popular";
const TMDB_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOWU0YTYzNDFlYjkwMjZkMDViY2Y3NWQ3YzMzNTc4YyIsIm5iZiI6MTc0Mzk0Njg4Mi45OTUwMDAxLCJzdWIiOiI2N2YyODQ4MjhiMWYzMmViNzlkOWMxYzUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.YwSEt3JbFA5NFDC2dUUKDgEEhYwckF7VZ9s-etsh5uk";

export const useMovies = () => {
  const [movies, setMovies] = useState<MovieResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${TMDB_API_URL}?language=en-US&page=1`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${TMDB_TOKEN}`,
            accept: "application/json",
          },
        });

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
  }, []);

  return { movies, loading, error };
};
