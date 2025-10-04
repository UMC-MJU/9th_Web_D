import { useState } from "react";
import type { Movie } from "../types/movie";
import { TMDB_CONFIG } from "../config/api";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const getImageUrl = (posterPath: string) => {
    return `${TMDB_CONFIG.IMAGE_BASE_URL}${posterPath}`;
  };

  return (
    <div
      className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-lg transition-all duration-400 cursor-pointer hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(251,113,133,0.3),0_0_40px_rgba(251,113,133,0.2),0_0_60px_rgba(251,113,133,0.1)] hover:scale-105"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative w-full h-full">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className={`w-full h-full object-cover transition-all duration-300 ${
            isHovered ? "blur-sm" : ""
          }`}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/80 flex items-center justify-center p-6 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="text-white text-center">
            <p className="text-sm leading-relaxed">{movie.overview}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
