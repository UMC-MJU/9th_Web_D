import { useEffect, useState } from "react";
import type { Movie } from "../types/movie";
import axios from "axios";


export default function useAPI( pageNum : number = 1 ) {
    const [movie, setMovie] = useState<Movie[]>([]);

    useEffect(() : void => {
      const getMovieAPI = async () : Promise<void> => {
        const { data } = await axios(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=${pageNum}`, {
          headers: {
            Authorization : `Bearer ${import.meta.env.VITE_MOVIE_KEY}`
          },
        });
        setMovie(data.results);
      }; 
      getMovieAPI();
    }, [pageNum]);

    return { movie };
}