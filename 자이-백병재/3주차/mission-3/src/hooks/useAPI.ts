import { useEffect, useState } from "react";
import type { Movie } from "../types/movie";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function useAPI( pageNum : number = 1 ) {
    const [movie, setMovie] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const { category } = useParams();

    useEffect(() : void => {
      const getMovieAPI = async () : Promise<void> => {
        setIsLoading(true);
        
        try {
            const { data } = await axios(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=${pageNum}`, {
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
    }, [pageNum, category]);

    return { movie, isLoading, isError };
}