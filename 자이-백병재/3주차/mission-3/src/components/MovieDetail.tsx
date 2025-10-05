import type { Movie } from "../types/movie"

const MovieDetail = ({ movie }: { movie: Movie }) => {

    return(
<img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={`${movie.title} poster`}
              style={{ width: '100%' }}
              className=" group-hover:blur-md group-hover:brightness-25 rounded-3xl w-full h-full transition-all duration-200 "
            />
    );
}

export default MovieDetail