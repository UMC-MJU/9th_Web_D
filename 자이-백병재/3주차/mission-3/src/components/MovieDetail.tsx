import type { Detail } from "../types/detail";
import StarPoint from "./StarPoint";

const MovieDetail = ({ movie }: { movie: Detail }) => {
    const bgImg = `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`;

    return (
        <div className="relative w-full h-[1250px] text-white">
            
            <div
                className="absolute inset-0 bg-cover bg-top"
                style={{ backgroundImage: `url(${bgImg})` }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
            
            <div className="relative h-full flex flex-col justify-end max-w-6xl mx-auto p-8 md:p-12">
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {movie.title}
                </h1>

                <div className="flex items-center gap-x-4 mb-6">
                    <StarPoint score={movie.vote_average} />
                    <p className="text-lg text-gray-300">({movie.vote_count.toLocaleString()} votes)</p>
                </div>

                <p className="text-base md:text-lg leading-relaxed max-w-3xl">
                    {movie.overview}
                </p>
            </div>
        </div>
    );
};

export default MovieDetail