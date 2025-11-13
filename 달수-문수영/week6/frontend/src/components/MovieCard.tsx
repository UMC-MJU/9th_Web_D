import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export interface TmdbMovie {
	id: number;
	title: string;
	overview: string;
	poster_path: string | null;
	release_date?: string;
	vote_average?: number;
}

interface MovieCardProps {
	movie: TmdbMovie;
}

export default function MovieCard({ movie }: MovieCardProps) {
	const navigate = useNavigate();
	const [isImageLoaded, setIsImageLoaded] = useState(false);

	const posterUrl = movie.poster_path
		? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
		: '';

	return (
		<div
			role="button"
			aria-label={`${movie.title} 상세 보기`}
			onClick={() => navigate(`/movies/${movie.id}`)}
			className="relative group cursor-pointer overflow-hidden rounded-xl shadow transition-transform duration-300 hover:scale-105"
		>
			{posterUrl ? (
				<img
					src={posterUrl}
					alt={movie.title}
					onLoad={() => setIsImageLoaded(true)}
					className={`w-full h-full object-cover block ${isImageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
				/>
			) : (
				<div className="w-full aspect-[2/3] bg-gray-200" />
			)}

			{/* Overlay with metadata on hover */}
			<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-end">
				<div className="text-white">
					<div className="text-sm font-semibold line-clamp-2">{movie.title}</div>
					<div className="mt-1 text-[11px] text-gray-200 flex items-center gap-2">
						<span>{movie.release_date?.slice(0, 4) ?? 'N/A'}</span>
						<span aria-hidden="true">·</span>
						<span>★ {typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : '0.0'}</span>
					</div>
				</div>
			</div>
		</div>
	);
}



