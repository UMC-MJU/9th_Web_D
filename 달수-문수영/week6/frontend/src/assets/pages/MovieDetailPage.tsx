import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

interface MovieDetail {
	id: number;
	title: string;
	overview: string;
	poster_path: string | null;
	backdrop_path: string | null;
	release_date?: string;
	runtime?: number;
	vote_average?: number;
	genres?: { id: number; name: string }[];
}

export default function MovieDetailPage() {
	const { id } = useParams<{ id: string }>();

	const { data, isLoading, isError, refetch } = useQuery({
		enabled: Boolean(id),
		queryKey: ['tmdb', 'movie', id],
		queryFn: async () => {
			const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=ko-KR`, {
				headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` },
			});
			if (!res.ok) throw new Error('TMDB 요청 실패');
			const json = (await res.json()) as MovieDetail;
			return json;
		},
		staleTime: 60 * 1000,
		gcTime: 10 * 60 * 1000,
	});

	if (isError) {
		return (
			<div className="p-6">
				<div className="p-4 border rounded bg-red-50 text-red-700 flex items-center justify-between gap-4">
					<div>영화 상세를 불러오지 못했습니다.</div>
					<button onClick={() => refetch()} className="px-3 py-1 text-sm rounded bg-black text-white hover:bg-gray-800 transition-colors">
						재시도
					</button>
				</div>
			</div>
		);
	}

	if (isLoading || !data) {
		return (
			<div className="p-6 max-w-5xl mx-auto">
				<div className="h-48 rounded-xl bg-gray-200 animate-pulse mb-6" />
				<div className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-6">
					<div className="aspect-[2/3] bg-gray-200 rounded animate-pulse" />
					<div className="space-y-3">
						<div className="h-7 bg-gray-200 rounded w-2/3 animate-pulse" />
						<div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
						<div className="h-20 bg-gray-200 rounded w-full animate-pulse" />
					</div>
				</div>
			</div>
		);
	}

	const posterUrl = data.poster_path ? `https://image.tmdb.org/t/p/w300${data.poster_path}` : '';
	const backdropUrl = data.backdrop_path ? `https://image.tmdb.org/t/p/w780${data.backdrop_path}` : '';

	return (
		<div className="p-6 max-w-5xl mx-auto">
			{/* Backdrop */}
			{backdropUrl && (
				<div
					className="h-48 rounded-xl bg-cover bg-center mb-6"
					style={{ backgroundImage: `url(${backdropUrl})` }}
					aria-hidden="true"
				/>
			)}
			<div className="grid grid-cols-1 md:grid-cols-[220px,1fr] gap-6">
				{posterUrl ? (
					<img src={posterUrl} alt={data.title} className="w-full md:w-[220px] aspect-[2/3] object-cover rounded-xl shadow" />
				) : (
					<div className="w-full md:w-[220px] aspect-[2/3] rounded-xl bg-gray-200" />
				)}
				<div>
					<h1 className="text-2xl font-bold">{data.title}</h1>
					<div className="text-sm text-gray-600 mt-1 flex flex-wrap items-center gap-2">
						<span>{data.release_date?.slice(0, 4) ?? 'N/A'}</span>
						{typeof data.runtime === 'number' && (
							<>
								<span aria-hidden="true">·</span>
								<span>{data.runtime}분</span>
							</>
						)}
						{typeof data.vote_average === 'number' && (
							<>
								<span aria-hidden="true">·</span>
								<span>★ {data.vote_average.toFixed(1)}</span>
							</>
						)}
					</div>
					{data.genres && data.genres.length > 0 && (
						<div className="mt-2 text-sm text-gray-700">
							장르: {data.genres.map((g) => g.name).join(', ')}
						</div>
					)}
					<p className="mt-4 text-gray-800 leading-relaxed">{data.overview || '설명이 없습니다.'}</p>
					<div className="mt-6">
						<Link to="/" className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100">
							뒤로 가기
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}


