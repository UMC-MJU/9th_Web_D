import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Movie, MovieResponse } from '../types/movie';
import MoiveCard from '../components/MoiveCard';

export default function MoviePage() {
    const [movies, setMovies] = useState<Movie[]>([]);

    ///1. 로딩 상태
    const [isPending, setIsPending] = useState(false);
    ///2. 에러 상태
    const [isError, setIsError] = useState(false);
    
    useEffect(():void => {
        const fetchMovies = async (): Promise<void> => {
            setIsPending(true);

        try{       
            const {data} = await axios.get<MovieResponse>(
                    'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
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
    },[]);

    return(
        <div className='p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
            {movies && movies.map((movie) => (
                <MoiveCard key={movie.id} movie={movie} />
            ))}
        </div>
    );
}