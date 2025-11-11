import { useParams, Link } from 'react-router-dom';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import QueryState from '../../components/QueryState';

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
	const [reviewOrder, setReviewOrder] = useState<'desc' | 'asc'>('desc');

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

	// 로딩/에러/데이터 없음 처리(공통 컴포넌트로 통일)
	if (isLoading || isError || !data) {
		return (
			<div className="p-6 max-w-5xl mx-auto">
				<QueryState
					isLoading={isLoading || !data}
					isError={isError}
					onRetry={() => refetch()}
					skeleton={
						<>
							<div className="h-56 md:h-64 rounded-2xl bg-gray-200 animate-pulse mb-6" />
							<div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
								<div className="aspect-[2/3] bg-gray-200 rounded animate-pulse" />
								<div className="space-y-3">
									<div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
									<div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
									<div className="h-28 bg-gray-200 rounded w-full animate-pulse" />
								</div>
							</div>
						</>
					}
				>
					{/* children not used in skeleton/error path */}
				</QueryState>
			</div>
		);
	}

	// 여기부터는 data가 반드시 존재
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

			{/* Reviews (TMDB) */}
			<MovieReviews movieId={id!} order={reviewOrder} onChangeOrder={setReviewOrder} />
		</div>
	);
}

interface MovieReviewsProps {
	movieId: string;
	order: 'desc' | 'asc';
	onChangeOrder: (o: 'desc' | 'asc') => void;
}

interface TmdbReview {
	id: string;
	author: string;
	content: string;
	created_at: string;
	author_details?: {
		rating?: number | null;
		username?: string;
	};
}

interface TmdbReviewResponse {
	page: number;
	total_pages: number;
	results: TmdbReview[];
}

function MovieReviews({ movieId, order, onChangeOrder }: MovieReviewsProps) {
	const {
		data,
		isLoading,
		isError,
		error,
		refetch,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		enabled: Boolean(movieId),
		queryKey: ['movieReviews', movieId, order],
		queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
			const v4Token = import.meta.env.VITE_TMDB_KEY as string | undefined;
			const v3Key = import.meta.env.VITE_TMDB_V3_KEY as string | undefined;
			let url = `https://api.themoviedb.org/3/movie/${movieId}/reviews?page=${pageParam}`;
			const init: RequestInit = {};
			if (v4Token) {
				init.headers = { Authorization: `Bearer ${v4Token}` };
			} else if (v3Key) {
				url += `&api_key=${v3Key}`;
			}
			const res = await fetch(url, init);
			if (!res.ok) throw new Error('TMDB 리뷰 요청 실패');
			const json = (await res.json()) as TmdbReviewResponse;
			return json;
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
		staleTime: 30 * 1000,
		gcTime: 5 * 60 * 1000,
	});

	const reviews: TmdbReview[] = useMemo(
		() => (data?.pages ?? []).flatMap((p) => p.results ?? []),
		[data]
	);

	const sorted = useMemo(() => {
		const copy = [...reviews];
		copy.sort((a, b) => {
			const aTs = a.created_at ? new Date(a.created_at).getTime() : 0;
			const bTs = b.created_at ? new Date(b.created_at).getTime() : 0;
			return order === 'desc' ? bTs - aTs : aTs - bTs;
		});
		return copy;
	}, [reviews, order]);

	const sentinelRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		if (!sentinelRef.current) return;
		const el = sentinelRef.current;
		const observer = new IntersectionObserver((entries) => {
			const first = entries[0];
			if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
				fetchNextPage();
			}
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

	return (
		<section className="mt-8">
			<div className="flex items-center justify-between mb-3">
				<h2 className="text-base font-semibold">리뷰</h2>
				<div className="flex items-center gap-2">
					<label className="text-xs text-gray-600">정렬</label>
					<div className="inline-flex rounded border overflow-hidden">
						<button
							type="button"
							aria-pressed={order === 'desc'}
							onClick={() => onChangeOrder('desc')}
							className={`px-3 py-1 text-xs ${order === 'desc' ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
						>
							최신순
						</button>
						<button
							type="button"
							aria-pressed={order === 'asc'}
							onClick={() => onChangeOrder('asc')}
							className={`px-3 py-1 text-xs border-l ${order === 'asc' ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
						>
							오래된순
						</button>
					</div>
				</div>
			</div>

			{/* 작성 폼(UI 전용) */}
			<div className="mb-4 border rounded p-3 bg-white">
				<label htmlFor="review-input" className="block text-xs font-medium text-gray-600 mb-2">
					리뷰 작성
				</label>
				<textarea
					id="review-input"
					className="w-full min-h-24 border rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
					placeholder="댓글을 입력해주세요."
					disabled
				/>
				<div className="mt-2 flex items-center justify-between text-xs text-gray-500">
					<button
						type="button"
						disabled
						className="px-3 py-1 rounded bg-gray-300 text-white cursor-not-allowed"
						aria-disabled="true"
					>
						등록
					</button>
				</div>
			</div>

			<QueryState
				isLoading={isLoading}
				isError={isError}
				onRetry={() => refetch()}
				errorMessage={(error as Error | undefined)?.message}
				skeleton={
					<ul className="divide-y border rounded animate-pulse">
						{Array.from({ length: 5 }).map((_, i) => (
							<li key={i} className="p-3">
								<div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
								<div className="h-3 bg-gray-200 rounded w-2/3" />
							</li>
						))}
					</ul>
				}
			>
				<>
					<ul className="divide-y border rounded">
						{sorted.map((r) => (
							<li key={r.id} className="p-3">
								<div className="text-xs text-gray-500 mb-1">
									{r.author || r.author_details?.username || '익명'} ·{' '}
									{r.author_details?.rating != null ? `★ ${r.author_details.rating}` : '평점 없음'} ·{' '}
									{r.created_at ? new Date(r.created_at).toLocaleString() : ''}
								</div>
								<div className="text-sm text-gray-800 whitespace-pre-wrap">{r.content}</div>
							</li>
						))}
						{sorted.length === 0 && (
							<li className="p-3 text-sm text-gray-500">등록된 리뷰가 없습니다.</li>
						)}
					</ul>

					{/* 하단 상태 */}
					{isFetchingNextPage ? (
						<ul className="mt-3 divide-y border rounded animate-pulse">
							{Array.from({ length: 3 }).map((_, i) => (
								<li key={i} className="p-3">
									<div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
									<div className="h-3 bg-gray-200 rounded w-2/3" />
								</li>
							))}
						</ul>
					) : (
						<div className="mt-3 flex items-center justify-center">
							{hasNextPage ? (
								<button
									onClick={() => fetchNextPage()}
									disabled={isFetchingNextPage}
									className="px-3 py-1 text-sm rounded bg-black text-white hover:bg-gray-800 transition-colors disabled:bg-gray-400"
								>
									더 보기
								</button>
							) : (
								<span className="text-xs text-gray-500">마지막 리뷰입니다.</span>
							)}
						</div>
					)}
					<div ref={sentinelRef} className="h-px" />
				</>
			</QueryState>
		</section>
	);
}


