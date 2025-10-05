import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import type { MovieDetails, CreditsResponse } from '../types/movie';

export const MovieDetailPage = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const [details, setDetails] = useState<MovieDetails | null>(null);
    const [credits, setCredits] = useState<CreditsResponse | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState<string | null>(null);

    useEffect(() => {
        if (!movieId) return;
        const controller = new AbortController();
        const fetchAll = async (): Promise<void> => {
            setIsPending(true);
            setIsError(null);
            try {
                const [detailsResult, creditsResult] = await Promise.allSettled([
                    axios.get<MovieDetails>(`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`, {
                        headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` },
                        signal: controller.signal,
                    }),
                    axios.get<CreditsResponse>(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`, {
                        headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` },
                        signal: controller.signal,
                    }),
                ]);

                if (detailsResult.status === 'fulfilled') {
                    setDetails(detailsResult.value.data);
                } else {
                    const reason: any = detailsResult.reason;
                    // Abort(StrictMode 더블 이펙트 등)로 취소된 경우는 에러로 표시하지 않음
                    if (!(reason && (reason.name === 'CanceledError' || reason.code === 'ERR_CANCELED'))) {
                        console.error(reason);
                        setIsError('영화 상세 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
                    }
                }

                if (creditsResult.status === 'fulfilled') {
                    setCredits(creditsResult.value.data);
                } else {
                    console.warn('크레딧을 불러오지 못했습니다:', creditsResult.reason);
                }
            } catch (err: any) {
                if (!((err instanceof DOMException && err.name === 'AbortError') || err?.code === 'ERR_CANCELED')) {
                    console.error(err);
                    setIsError('영화 상세 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
                }
            } finally {
                setIsPending(false);
            }
        };
        fetchAll();
        return () => controller.abort();
    }, [movieId]);

    if (isPending) {
        return <div className='p-6 text-center'>불러오는 중...</div>;
    }
    if (isError) {
        return <div className='p-6 text-center text-red-500'>{isError}</div>;
    }
    if (!details) {
        return <div className='p-6 text-center'>데이터가 없습니다.</div>;
    }

    const posterUrl = details.poster_path
        ? `https://image.tmdb.org/t/p/w300${details.poster_path}`
        : undefined;

    const topCast = (credits?.cast ?? []).slice(0, 10);

    return (
        <div className='px-6 py-8 max-w-5xl mx-auto'>
            <div className='flex flex-col sm:flex-row gap-6'>
                {posterUrl && (
                    <img src={posterUrl} alt={`${details.title} 포스터`} className='w-60 rounded-lg shadow' />
                )}
                <div className='flex-1'>
                    <h1 className='text-2xl font-bold mb-2'>{details.title}</h1>
                    <div className='text-sm text-gray-600 mb-4'>
                        {details.release_date} • {details.runtime ?? '-'}분 • {details.genres.map(g => g.name).join(', ')}
                    </div>
                    <p className='text-gray-800 leading-relaxed'>{details.overview || '줄거리 정보가 없습니다.'}</p>
                </div>
            </div>

            {!!topCast.length && (
                <div className='mt-8'>
                    <h2 className='text-lg font-semibold mb-3'>출연</h2>
                    <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
                        {topCast.map((c) => (
                            <li key={c.id} className='bg-white rounded-md p-3 shadow'>
                                <div className='text-sm font-medium'>{c.name}</div>
                                <div className='text-xs text-gray-600'>{c.character}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MovieDetailPage;