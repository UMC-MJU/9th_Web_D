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

  return(
    <div>
      <div>
        {movie.map((movieItem) => (
          <div key={movieItem.title} className="w-[200px]">
            {/* 영화 포스터 */}
            <img
              src={`https://image.tmdb.org/t/p/w200${movieItem.poster_path}`}
              alt={`${movieItem.title} poster`}
              style={{ width: '100%' }}/>
            {/* 영화 제목 */}
            <h3>{movieItem.title}</h3>
            {/* 영화 설명 */}
            <p>{movieItem.overview}</p>
          </div>
        ))}
      </div>
    </div>
    );
};

export default MoviePage;