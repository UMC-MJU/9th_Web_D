import { useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import MovieCard, { type TmdbMovie } from '../../components/MovieCard';
import QueryState from '../../components/QueryState';
import useDebounce from '../../hooks/useDebounce';

export default function MovieSearchPage() {
	const [query, setQuery] = useState('');
	const [isComposing, setIsComposing] = useState(false);
	const debouncedQuery = useDebounce(query.trim(), 300);

	const {
		data,
		isLoading,
		isError,
		error,
		refetch,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isFetching,
	} = useInfiniteQuery({
		enabled: debouncedQuery.length > 0 && !isComposing,
		queryKey: ['search', debouncedQuery],
		queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
			const v4Token = import.meta.env.VITE_TMDB_KEY as string | undefined;
			const v3Key = import.meta.env.VITE_TMDB_V3_KEY as string | undefined;
			let url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
				debouncedQuery
			)}&language=ko-KR&page=${pageParam}`;
			const init: RequestInit = {};
			if (v4Token) {
				init.headers = { Authorization: `Bearer ${v4Token}` };
			} else if (v3Key) {
				url += `&api_key=${v3Key}`;
			}
			const res = await fetch(url, init);
			if (!res.ok) throw new Error('TMDB 검색 요청 실패');
			const json = (await res.json()) as { results: TmdbMovie[]; page: number; total_pages: number };
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
		<div className="p-6 mx-auto max-w-6xl">
			<section aria-labelledby="movie-search">
				<h2 id="movie-search" className="text-xl font-semibold mb-3">영화 검색</h2>
				<div className="mb-4">
					<label htmlFor="search-input" className="block text-xs font-medium text-gray-600 mb-1">
						검색어
					</label>
					<input
						id="search-input"
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onCompositionStart={() => setIsComposing(true)}
						onCompositionEnd={(e) => {
							setIsComposing(false);
							// 조합 완료 시점의 값으로 한번 더 동기화하여 디바운스가 정확히 동작하도록 보장
							setQuery(e.currentTarget.value);
						}}
						placeholder="영화 제목을 입력하세요"
						className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
					/>
			
				</div>

				{debouncedQuery.length === 0 || isComposing ?		null : (
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
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
								{movies.map((m) => (
									<MovieCard key={m.id} movie={m} />
								))}
							</div>
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
							{movies.length === 0 && (
								<div className="mt-4 text-sm text-gray-500">검색 결과가 없습니다.</div>
							)}
						</>
					</QueryState>
				)}
			</section>
		</div>
	);
}


