import { useEffect, useState } from "react";
import type { Movie } from "../types/movie";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function useAPI( pageNum : number = 1 ) {
    const [movie, setMovie] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const { category, id } = useParams();
    let api = '';

    useEffect(() : void => {
      const getMovieAPI = async () : Promise<void> => {
        setIsLoading(true);
        
        if(id) api = `https://api.themoviedb.org/3/movie/${id}?language=en-US&`;
        else api = `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=${pageNum}`;

        try {
            const { data } = await axios(api, {
                headers: {
                    Authorization : `Bearer ${import.meta.env.VITE_MOVIE_KEY}`
                },
            });
            if (id) {
                    setMovie([data]);
                } else {
                    setMovie(data.results);
                }
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