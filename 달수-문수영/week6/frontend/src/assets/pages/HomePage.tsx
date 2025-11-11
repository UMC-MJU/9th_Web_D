import { useInfiniteQuery } from '@tanstack/react-query';
import MovieCard, { type TmdbMovie } from '../../components/MovieCard';
import QueryState from '../../components/QueryState';
import { useState, useMemo, useEffect, useRef } from 'react';

function PopularMoviesGrid() {
	const [order, setOrder] = useState<'desc' | 'asc'>('desc');
	const {
		data,
		isLoading,
		isError,
		error,
		refetch,
		isFetching,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ['tmdb', 'popular'],
		queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
			const v4Token = import.meta.env.VITE_TMDB_KEY as string | undefined;
			const v3Key = import.meta.env.VITE_TMDB_V3_KEY as string | undefined;
			let url = `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${pageParam}`;
			const init: RequestInit = {};
			if (v4Token) {
				init.headers = { Authorization: `Bearer ${v4Token}` };
			} else if (v3Key) {
				url += `&api_key=${v3Key}`;
			}
			const res = await fetch(url, init);
			if (!res.ok) throw new Error('TMDB 요청 실패');
			const json = await res.json() as { results: TmdbMovie[]; page: number; total_pages: number };
			return json;
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
		},
		staleTime: 30 * 1000,
		gcTime: 5 * 60 * 1000,
	});

	const movies: TmdbMovie[] = useMemo(
		() => (data?.pages ?? []).flatMap((p) => p.results ?? []),
		[data]
	);
	const sortedMovies = useMemo(() => {
		const copy = [...movies];
		copy.sort((a, b) => {
			const aDate = a.release_date ? new Date(a.release_date).getTime() : 0;
			const bDate = b.release_date ? new Date(b.release_date).getTime() : 0;
			return order === 'desc' ? bDate - aDate : aDate - bDate;
		});
		return copy;
	}, [movies, order]);

	// Auto-load on reach bottom
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
		<QueryState
			isLoading={isLoading}
			isError={isError}
			onRetry={() => refetch()}
			errorMessage={(error as Error | undefined)?.message}
			skeleton={
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
					{Array.from({ length: 12 }).map((_, i) => (
						<div key={i} className="rounded-xl overflow-hidden shadow bg-gray-200 aspect-[2/3] animate-pulse" />
					))}
				</div>
			}
		>
			<>
				<div className="mb-3 flex items-center justify-between">
					<div className="inline-flex rounded border overflow-hidden">
						<button
							type="button"
							aria-pressed={order === 'desc'}
							onClick={() => setOrder('desc')}
							className={`px-3 py-1 text-sm ${order === 'desc' ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
						>
							최신순
						</button>
						<button
							type="button"
							aria-pressed={order === 'asc'}
							onClick={() => setOrder('asc')}
							className={`px-3 py-1 text-sm border-l ${order === 'asc' ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
						>
							오래된순
						</button>
					</div>
				</div>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
					{sortedMovies.map((m) => (
						<MovieCard key={m.id} movie={m} />
					))}
				</div>

				{/* 하단 상태 영역: isFetchingNextPage 시 카드 크기 스켈레톤 표시 */}
				{isFetchingNextPage ? (
					<div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
						{Array.from({ length: 6 }).map((_, i) => (
							<div key={i} className="rounded-xl overflow-hidden shadow bg-gray-200 aspect-[2/3] animate-pulse" />
						))}
					</div>
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
							<span className="text-xs text-gray-500">마지막 페이지입니다.</span>
						)}
					</div>
				)}
				<div ref={sentinelRef} className="h-px" />
				<div className="mt-2 text-xs text-gray-500">{isFetching ? '갱신 중...' : ''}</div>
			</>
		</QueryState>
	);
}


const HomePage = () => {
		return (
				<div className="p-6 mx-auto max-w-6xl">
						<section aria-labelledby="popular-movies">
								<h2 id="popular-movies" className="text-xl font-semibold mb-3">인기 영화</h2>
								<PopularMoviesGrid />
						</section>
				</div>
		);
};

export default HomePage;