import { useState } from "react";
import { useGetMovie } from "../hooks/useGetMovie";
import type { IMovie } from "../types/movie";
import { MovieModal } from "./MovieModal";

interface MovieListProps {
  searchParams: {
    query: string;
    include_adult: boolean;
    language: string;
  };
}

export const MovieList = ({ searchParams }: MovieListProps) => {
  const { data, isLoading, isError } = useGetMovie(searchParams);
  

  const [selectedMovie, setSelectedMovie] = useState<IMovie | null>(null);

  if (isLoading) return <div className="text-center py-20 text-gray-500 font-medium">데이터를 불러오는 중입니다...</div>;
  if (isError) return <div className="text-center py-20 text-red-500 font-bold">에러가 발생했습니다 😢</div>;

  const movies = data?.results || [];

  if (movies.length === 0) {
    return <div className="text-center py-20 text-gray-400 text-lg">검색 결과가 없습니다.</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {movies.map((movie: IMovie) => (
          <div 
            key={movie.id} 

            onClick={() => setSelectedMovie(movie)}
            className="w-full bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 cursor-pointer"
          >
            
            <div className="group relative w-full aspect-[2/3] overflow-hidden bg-gray-200">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                  NO IMAGE
                </div>
              )}

              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <span className="text-white font-bold border border-white px-4 py-2 rounded-full">
                    상세보기
                 </span>
              </div>
            </div>

            <div className="p-4 h-[70px] flex items-center justify-center">
              <h1 className="text-base font-bold text-center text-slate-800 line-clamp-2">
                {movie.title}
              </h1>
            </div>
          </div>
        ))}
      </div>

      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </>
  );
};