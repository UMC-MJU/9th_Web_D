import { NavLink } from "react-router-dom";
import type { Movie } from "../types/movie";

const MovieList = ({ movie }: { movie: Movie[] }) => {

    return (    
    <div>
      <div className="flex flex-wrap m-5 gap-5 justify-center">
        {movie.map((movieItem) => (
          <NavLink key={movieItem.id} 
          to = {`/details/${movieItem.id}`}
          className=" p-2.5 w-[100px] md:w-[200px] xl:w-[300px] group relative rounded-3xl overflow-hidden">
            {/* 영화 포스터 이미지 */}
            <img
              src={`https://image.tmdb.org/t/p/w200${movieItem.poster_path}`}
              alt={`${movieItem.title} poster`}
              style={{ width: '100%' }}
              className=" group-hover:blur-md group-hover:brightness-25 rounded-3xl w-full h-full transition-all duration-200 "
            />
            <div className="absolute px-10 py-20 inset-0 flex flex-col justify-between 
            opacity-0 group-hover:opacity-100 transition-all duration-200 text-amber-50">
              {/* 영화 제목 */}
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold line-clamp-2">{movieItem.title}</h3>
              {/* 영화 설명 */}
              <p className="text-sm md:text-md lg:text-lg line-clamp-2">{movieItem.overview}</p>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
    );
}

export default MovieList;