import { useQuery } from '@tanstack/react-query';
import MovieCard, { type TmdbMovie } from '../../components/MovieCard';
import QueryState from '../../components/QueryState';

function PopularMoviesGrid() {
	const { data, isLoading, isError, refetch, isFetching, error } = useQuery({
		queryKey: ['tmdb', 'popular'],
		queryFn: async () => {
			const v4Token = import.meta.env.VITE_TMDB_KEY as string | undefined;
			const v3Key = import.meta.env.VITE_TMDB_V3_KEY as string | undefined;
			let url = `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1`;
			const init: RequestInit = {};
			if (v4Token) {
				init.headers = { Authorization: `Bearer ${v4Token}` };
			} else if (v3Key) {
				url += `&api_key=${v3Key}`;
			}
			const res = await fetch(url, init);
			if (!res.ok) throw new Error('TMDB 요청 실패');
			const json = await res.json() as { results: TmdbMovie[] };
			return json.results;
		},
		staleTime: 30 * 1000,
		gcTime: 5 * 60 * 1000,
	});

	const movies = data ?? [];

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
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
					{movies.map((m) => (
						<MovieCard key={m.id} movie={m} />
					))}
				</div>
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