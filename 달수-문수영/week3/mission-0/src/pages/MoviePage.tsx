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
         <div className='flex items-center justify-center gap-6 mt-5'>
            <button
                className='bg-[#169514] text-black px-6 py-3 rounded-lg shadow-md
                hover:bg-[#61915e] transition-all duration-200 disabled:bg-[#ccc]
                cursor-pointer disabled:cursor-not-allowed'
                disabled={page === 1}
                onClick={():void => setPage((prev):number => prev - 1)}
                >{'<'}</button>
            <span>{page}페이지</span>
            <button
                className='bg-[#b2dab1] text-black px-6 py-3 rounded-lg shadow-md
                hover:bg-[#9cc699] transition-all duration-200 cursor-pointer'
                onClick={():void => setPage((prev):number => prev + 1)}
                >{'>'}</button>
         </div>
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
        </>
    );
}