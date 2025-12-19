import { useCallback, useState } from "react";
import { useGetMovie } from "../hooks/useGetMovie";
import type { IMovie } from "../types/movie";
import { MovieModal } from "./MovieModal";
import MovieCard from "./MovieCard";

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

  // [최적화 2] 핸들러 함수 메모이제이션 (MovieCard에 전달될 때 props 변경 방지)
  const handleSelectMovie = useCallback((movie: IMovie) => {
    setSelectedMovie(movie);
  }, []);

  // [최적화 3] 모달 닫기 핸들러 메모이제이션
  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

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
          // 분리한 컴포넌트 사용
          <MovieCard
            key={movie.id} 
            movie={movie} 
            onClick={handleSelectMovie} 
          />
        ))}
      </div>

      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie} 
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
};