import type { IMovie } from "../types/movie";

interface MovieModalProps {
  movie: IMovie;
  onClose: () => void;
}

export const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  return (

    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose} 
    >
      
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative w-full aspect-video">
          {movie.backdrop_path ? (
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
              이미지 없음
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-8 pt-20">
            <h2 className="text-3xl md:text-4xl font-bold text-white">{movie.title}</h2>
            {/* 개봉일 및 평점 */}
            <div className="flex items-center gap-4 mt-2 text-gray-300">
               <span className="bg-yellow-500 text-black px-2 py-1 rounded font-bold text-xs">
                 ★ {movie.vote_average.toFixed(1)}
               </span>
               <span>{movie.release_date}</span>
            </div>
          </div>
        </div>

        <div className="p-8">
          <h3 className="text-xl font-bold mb-3 text-slate-800">줄거리</h3>
          <p className="text-gray-600 leading-relaxed text-lg">
            {movie.overview || "상세 설명이 등록되지 않은 영화입니다."}
          </p>

          <div className="mt-6 pt-6 border-t border-gray-200 flex gap-6 text-sm text-gray-500">
             <div>
               <span className="block font-bold text-gray-700">투표 수</span>
               {movie.vote_count.toLocaleString()}명
             </div>
             <div>
               <span className="block font-bold text-gray-700">원제</span>
               {movie.original_title} ({(movie.original_language).toUpperCase()})
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};