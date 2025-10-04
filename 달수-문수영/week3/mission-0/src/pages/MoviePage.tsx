import { useEffect } from 'react';
import axios from 'axios';

export default function MoviePage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    
    useEffect(():void => {
        const fetchMovies = async (): Promise<void> => {
            const {data} = await axios(
                'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc',
                {
                    headers: {
                        'Authorization': `Bearer ${import.meta.env.VITE_TMDB_KEY}`
                    }
                }
            );
            setMovies(data.result);
        };

        fetchMovies();
    },[]);

    return(
        <div>
            {movies && movies.map((movie) => (
                <MoiveCard key={movie.id} movie={movie} />
            ))}
        </div>
    );
}