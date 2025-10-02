import { useEffect, useState } from "react";
import axios from 'axios';
import type { Movie } from "../types/movie";

const MoviePage = () => {
    const [movie, setMovie] = useState<Movie[]>([]);

    useEffect(() : void => {
      const getMovieAPI = async () : Promise<void> => {
        const { data } = await axios('https://api.themoviedb.org/3/movie/popular?language=en-US', {
          headers: {
            Authorization : `Bearer ${import.meta.env.VITE_MOVIE_KEY}`
          },
        });
        setMovie(data.results);
      }; 
      getMovieAPI();
    }, []);
    
  return( <h1>영화 데이터 불러오기</h1>);
};

export default MoviePage;