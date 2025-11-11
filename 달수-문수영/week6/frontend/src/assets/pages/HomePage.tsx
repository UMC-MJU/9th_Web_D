import { useQuery } from '@tanstack/react-query';
import MovieCard, { type TmdbMovie } from '../../components/MovieCard';

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

	if (isError) {
		return (
			<div className="p-4 border rounded bg-red-50 text-red-700 flex items-center justify-between gap-4">
				<div>
					영화 목록을 불러오지 못했습니다.
					<span className="ml-2 text-xs text-red-500">{(error as Error | undefined)?.message}</span>
				</div>
				<button onClick={() => refetch()} className="px-3 py-1 text-sm rounded bg-black text-white hover:bg-gray-800 transition-colors">
					재시도
				</button>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
				{Array.from({ length: 12 }).map((_, i) => (
					<div key={i} className="rounded-xl overflow-hidden shadow bg-gray-200 aspect-[2/3] animate-pulse" />
				))}
			</div>
		);
	}

	const movies = data ?? [];

	return (
		<>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
				{movies.map((m) => (
					<MovieCard key={m.id} movie={m} />
				))}
			</div>
			<div className="mt-2 text-xs text-gray-500">{isFetching ? '갱신 중...' : ''}</div>
		</>
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