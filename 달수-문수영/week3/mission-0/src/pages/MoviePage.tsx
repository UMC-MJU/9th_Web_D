import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Movie, MovieResponse } from '../types/movie';
import MoiveCard from '../components/MoiveCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useParams } from 'react-router-dom';

export default function MoviePage() {
    const [movies, setMovies] = useState<Movie[]>([]);

    ///1. 로딩 상태
    const [isPending, setIsPending] = useState(false);
    ///2. 에러 상태
    const [isError, setIsError] = useState(false);
    ///3.페이지
    const [page, setPage] = useState(1);

    const {category} = useParams<{
        category: string;
    }>();
    
    useEffect(():void => {
        const fetchMovies = async (): Promise<void> => {
            setIsPending(true);

        try{       
            const {data} = await axios.get<MovieResponse>(
                    `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${import.meta.env.VITE_TMDB_KEY}`
                        },
                    }
                );

                setMovies(data.results);
            }  catch{
                setIsError(true);
            } finally {
                setIsPending(false);
            }

        };

        fetchMovies();
    },[page, category]);

    if(isError) {
        return(
            <div>
                <span className='text-red-500'>Error loading movies</span>
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