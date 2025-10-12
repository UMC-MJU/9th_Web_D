import { useMemo, useState } from 'react';
import type { Movie, MovieResponse } from '../types/movie';
import MoiveCard from '../components/MoiveCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useParams } from 'react-router-dom';
import useCustomFetch from '../hooks/useCustomFetch';

export default function MoviePage() {
    const [page, setPage] = useState(1);
    const {category} = useParams<{ category: string }>();

    const fetcher = useMemo(() => (
        async (signal: AbortSignal): Promise<Movie[]> => {
            const res = await fetch(`https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`, {
                headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` },
                signal,
            });
            if (!res.ok) throw new Error('Failed to fetch movies');
            const json: MovieResponse = await res.json();
            return json.results;
        }
    ), [category, page]);

    const { data: movies, isPending, isError } = useCustomFetch<Movie[]>({
        fetcher,
        deps: [category, page],
        initialData: [],
        enabled: Boolean(category),
    });

    if(isError) {
        return(
            <div className='min-h-screen flex flex-col items-center justify-center gap-4 p-6'>
                <div className='text-red-500 font-medium'>영화 목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</div>
                <button
                    className='px-4 py-2 rounded bg-black text-white hover:bg-gray-800'
                    onClick={() => location.reload()}
                >
                    다시 시도
                </button>
            </div>
        )
    }

    return(
        <>
         <div className='bg-gray-300 py-8'>
         <nav aria-label='페이지 네비게이션' className='flex items-center justify-center'>
            <ul className='inline-flex items-center gap-3'>
                <li>
                    <button
                        aria-label={`이전 페이지 ${page > 1 ? page - 1 : 1}로 이동`}
                        className='px-4 h-10 inline-flex items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-300 transition disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed'
                        disabled={page === 1}
                        onClick={():void => setPage((prev):number => prev - 1)}
                    >
                        {page > 1 ? page - 1 : '이전'}
                    </button>
                </li>
                <li>
                    <span aria-live='polite' className='px-4 h-10 inline-flex items-center justify-center rounded-full bg-black text-white text-sm font-medium shadow'>
                        {page} 페이지
                    </span>
                </li>
                <li>
                    <button
                        aria-label={`다음 페이지 ${page + 1}로 이동`}
                        className='px-4 h-10 inline-flex items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-300 transition'
                        onClick={():void => setPage((prev):number => prev + 1)}
                    >
                        {page + 1}
                    </button>
                </li>
            </ul>
         </nav>
        {isPending && (
            <div className='flex items-center justify-center h-dvh'>
                <LoadingSpinner />
            </div>
        )}

        {!isPending && (
            <div className='p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 
                md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
                {movies && movies.map((movie) => (
                    <MoiveCard key={movie.id} movie={movie} />
                ))}
            </div>
        )}
         </div>
        </>
    );
}