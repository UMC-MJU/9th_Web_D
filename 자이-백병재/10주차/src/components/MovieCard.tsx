import { memo } from "react";
import type { IMovie } from "../types/movie";


// [최적화 1] 개별 영화 카드 컴포넌트 분리 및 memo 적용
// 이렇게 해야 모달을 열어도 뒷배경(리스트)들이 리렌더링 되지 않음
const MovieCard = memo(({ movie, onClick }: { movie: IMovie; onClick: (movie: IMovie) => void }) => {
  return (
    <div 
      onClick={() => onClick(movie)}
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
  );
});

export default MovieCard