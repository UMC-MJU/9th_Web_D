import { useEffect, useState } from "react";
import type { Movie } from "../types/movie";
import axios from "axios";

export default function useAPI( pageNum : number = 1 ) {
    const [movie, setMovie] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() : void => {
      const getMovieAPI = async () : Promise<void> => {
        setIsLoading(true);
        
        try {
            const { data } = await axios(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=${pageNum}`, {
                headers: {
                    Authorization : `Bearer ${import.meta.env.VITE_MOVIE_KEY}`
                },
            });
            setMovie(data.results);
            setIsError(false);           
        } catch {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }

      }; 
      getMovieAPI();
    }, [pageNum]);

    return { movie, isLoading, isError };
}