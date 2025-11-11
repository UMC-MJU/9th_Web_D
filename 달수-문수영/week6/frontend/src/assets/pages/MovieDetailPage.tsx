import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

interface MovieDetail {
	id: number;
	title: string;
	overview: string;
	poster_path: string | null;
	backdrop_path: string | null;
	release_date?: string;
	runtime?: number;
	vote_average?: number;
	vote_count?: number;
	genres?: { id: number; name: string }[];
}

export default function MovieDetailPage() {
	const { id } = useParams<{ id: string }>();
	const [liked, setLiked] = useState(false);

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
				<div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
					<div className="aspect-[2/3] bg-gray-200 rounded animate-pulse" />
					<div className="space-y-3">
						<div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
						<div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
						<div className="h-28 bg-gray-200 rounded w-full animate-pulse" />
					</div>
				</div>
			</div>
		);
	}

	const posterUrl = data.poster_path ? `https://image.tmdb.org/t/p/w342${data.poster_path}` : '';
	const backdropUrl = data.backdrop_path ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}` : '';

	return (
		<div className="p-6 max-w-5xl mx-auto">
			{/* Hero / Backdrop */}
			{backdropUrl && (
				<div
					className="h-56 md:h-64 rounded-2xl bg-cover bg-center mb-6"
					style={{ backgroundImage: `url(${backdropUrl})` }}
					aria-hidden="true"
				/>
			)}

			<article className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
				{/* Aside: Thumbnail */}
				<aside>
					{posterUrl ? (
						<img
							src={posterUrl}
							alt={data.title}
							className="w-full md:w-[240px] aspect-[2/3] object-cover rounded-xl shadow"
						/>
					) : (
						<div className="w-full md:w-[240px] aspect-[2/3] rounded-xl bg-gray-200" />
					)}
				</aside>

				{/* Main: Title + Meta + Content */}
				<section className="min-w-0">
					<header className="mb-3 flex items-start justify-between gap-3">
						<div className="min-w-0">
							<h1 className="text-2xl font-bold">{data.title}</h1>
							<ul className="mt-2 flex flex-wrap items-center gap-2 text-xs">
							<li className="px-2 py-1 rounded-full border text-gray-600">
								업로드일: {data.release_date ?? 'N/A'}
							</li>
							<li className="px-2 py-1 rounded-full border text-gray-600">
								평점: ★ {typeof data.vote_average === 'number' ? data.vote_average.toFixed(1) : '0.0'}
							</li>
							{typeof data.vote_count === 'number' && (
								<li className="px-2 py-1 rounded-full border text-gray-600">
									좋아요: {(data.vote_count + (liked ? 1 : 0)).toLocaleString()}
								</li>
							)}
							{typeof data.runtime === 'number' && (
								<li className="px-2 py-1 rounded-full border text-gray-600">
									러닝타임: {data.runtime}분
								</li>
							)}
							</ul>
							{data.genres && data.genres.length > 0 && (
								<div className="mt-2 text-sm text-gray-700">
									장르: {data.genres.map((g) => g.name).join(', ')}
								</div>
							)}
						</div>

						{/* Action buttons */}
						<div className="shrink-0 flex items-center gap-2">
							<button
								type="button"
								className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 text-sm"
								onClick={() => alert('수정 기능은 데모에서 비활성화되어 있습니다.')}
							>
								수정
							</button>
							<button
								type="button"
								className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 text-sm"
								onClick={() => confirm('정말 삭제하시겠습니까?') && alert('삭제 기능은 데모에서 비활성화되어 있습니다.')}
							>
								삭제
							</button>
							<button
								type="button"
								aria-pressed={liked}
								className={`px-3 py-1 rounded text-sm ${liked ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-black text-white hover:bg-gray-800'}`}
								onClick={() => setLiked((v) => !v)}
							>
								{liked ? '좋아요 취소' : '좋아요'}
							</button>
						</div>
					</header>

					<section aria-labelledby="section-overview" className="mt-4">
						<h2 id="section-overview" className="text-base font-semibold mb-2">
							본문
						</h2>
						<div className="rounded-xl border p-4 text-gray-800 leading-relaxed bg-white">
							{data.overview || '설명이 없습니다.'}
						</div>
					</section>

					<div className="mt-6">
						<Link to="/" className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100">
							뒤로 가기
						</Link>
					</div>
				</section>
			</article>
		</div>
	);
}


