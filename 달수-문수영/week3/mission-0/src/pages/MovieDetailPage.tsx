import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import type { MovieDetails, CreditsResponse } from '../types/movie';
import useCustomFetch from '../hooks/useCustomFetch';

export const MovieDetailPage = () => {
    const { movieId } = useParams<{ movieId: string }>();

    const detailsFetcher = useMemo(() => (
        async (signal: AbortSignal): Promise<MovieDetails> => {
            const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`, {
                headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` },
                signal,
            });
            if (!res.ok) throw new Error('Failed to fetch details');
            return res.json();
        }
    ), [movieId]);

    const creditsFetcher = useMemo(() => (
        async (signal: AbortSignal): Promise<CreditsResponse> => {
            const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`, {
                headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` },
                signal,
            });
            if (!res.ok) throw new Error('Failed to fetch credits');
            return res.json();
        }
    ), [movieId]);

    const { data: details, isPending: isPendingDetails, isError: isErrorDetails } = useCustomFetch<MovieDetails>({
        fetcher: detailsFetcher,
        deps: [movieId],
        enabled: Boolean(movieId),
    });

    const { data: credits } = useCustomFetch<CreditsResponse>({
        fetcher: creditsFetcher,
        deps: [movieId],
        enabled: Boolean(movieId),
    });

    if (isPendingDetails) {
        return <div className='min-h-screen flex items-center justify-center'>불러오는 중...</div>;
    }
    if (isErrorDetails) {
        return (
            <div className='min-h-screen flex flex-col items-center justify-center gap-4 p-6'>
                <div className='text-red-500 font-medium'>영화 상세 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</div>
                <button
                    className='px-4 py-2 rounded bg-black text-white hover:bg-gray-800'
                    onClick={() => location.reload()}
                >
                    다시 시도
                </button>
            </div>
        );
    }
    if (!details) {
        return <div className='p-6 text-center'>데이터가 없습니다.</div>;
    }

    const posterUrl = details.poster_path
        ? `https://image.tmdb.org/t/p/w300${details.poster_path}`
        : undefined;

    const topCast = (credits?.cast ?? []).slice(0, 10);
    const directorName = credits?.crew.find((m) => m.job === 'Director')?.name;
    const releaseYear = details.release_date?.slice(0, 4) ?? '-';

    return (
        <div className='min-h-screen'>
            {/* Card */}
            <div className='max-w-5xl mx-auto px-6 mt-8'>
                <div className='rounded-xl border border-gray-800 bg-gray-900/70 backdrop-blur p-6 sm:p-8'>
                    <div className='flex flex-col sm:flex-row gap-6'>
                        {posterUrl && (
                            <img src={posterUrl} alt={`${details.title} 포스터`} className='w-44 sm:w-56 md:w-60 rounded-lg shadow' />
                        )}
                        <div className='flex-1'>
                            <h1 className='text-2xl sm:text-3xl font-bold text-white leading-snug'>{details.title}</h1>
                            <div className='mt-2 flex items-center gap-3'>
                                <span className='inline-flex items-center gap-1 text-amber-400 font-semibold'>★ {details.vote_average.toFixed(1)}</span>
                                <span className='text-sm text-gray-400'>평점</span>
                            </div>

                            <dl className='mt-4 space-y-2 text-sm text-gray-300'>
                                <div className='flex gap-2'>
                                    <dt className='w-16 text-gray-400'>개봉년도</dt>
                                    <dd>{releaseYear}</dd>
                                </div>
                                <div className='flex gap-2'>
                                    <dt className='w-16 text-gray-400'>상영시간</dt>
                                    <dd>{details.runtime ?? '-'}분</dd>
                                </div>
                                <div className='flex gap-2'>
                                    <dt className='w-16 text-gray-400'>장르</dt>
                                    <dd className='flex flex-wrap gap-2'>
                                        {details.genres.map((g) => (
                                            <span key={g.id} className='px-2 py-0.5 rounded-full bg-gray-800 text-gray-200 text-xs'>{g.name}</span>
                                        ))}
                                    </dd>
                                </div>
                                {directorName && (
                                    <div className='flex gap-2'>
                                        <dt className='w-16 text-gray-400'>감독</dt>
                                        <dd>{directorName}</dd>
                                    </div>
                                )}
                            </dl>

                            <div className='mt-4'>
                                <h2 className='text-sm font-semibold text-gray-300 mb-1'>줄거리</h2>
                                <p className='text-gray-200 leading-relaxed'>{details.overview || '줄거리 정보가 없습니다.'}</p>
                            </div>
                        </div>
                    </div>

                    {!!topCast.length && (
                        <div className='mt-8'>
                            <h2 className='text-lg font-semibold text-white mb-3'>주요 출연진</h2>
                            <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
                                {topCast.map((c) => (
                                    <li key={c.id} className='rounded-md border border-gray-800 bg-gray-800/60 p-3'>
                                        <div className='text-sm font-medium text-gray-100'>{c.name}</div>
                                        <div className='text-xs text-gray-400'>{c.character}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieDetailPage;