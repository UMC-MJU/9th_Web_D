import { useGetMovie } from "../hooks/useGetMovie";

interface MovieListProps {
  searchParams: {
    query: string;
    include_adult: boolean;
    language: string;
  };
}

export const MovieList = ({ searchParams }: MovieListProps) => {
  const { data, isLoading, isError } = useGetMovie(searchParams);

  if (isLoading) {
    return <div className="text-center py-20 text-gray-500 font-medium">데이터를 불러오는 중입니다...</div>;
  }

  if (isError) {
    return <div className="text-center py-20 text-red-500 font-bold">에러가 발생했습니다 😢</div>;
  }

  const movies = data?.results || [];

  if (movies.length === 0) {
    return <div className="text-center py-20 text-gray-400 text-lg">검색 결과가 없습니다.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
      {movies.map((movie) => (
        <div key={movie.id} className="w-full bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          
          {/* 이미지 영역 (호버 효과) */}
          <div className="group relative w-full aspect-[2/3] cursor-pointer overflow-hidden bg-gray-200">
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

            {/* 호버 시 나타나는 검은 오버레이 + 설명 */}
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="text-white text-sm text-center leading-relaxed line-clamp-6">
                {movie.overview || "상세 설명이 없습니다."}
              </p>
            </div>
          </div>

          {/* 제목 영역 */}
          <div className="p-4 h-[70px] flex items-center justify-center">
            <h1 className="text-base font-bold text-center text-slate-800 line-clamp-2">
              {movie.title}
            </h1>
          </div>
        </div>
      ))}
    </div>
  );
};