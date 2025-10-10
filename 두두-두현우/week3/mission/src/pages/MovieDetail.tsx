import { useParams, Link } from "react-router-dom";
import { useMovieDetail } from "../hooks/useMovieDetail";
import { TMDB_CONFIG } from "../config/api";
import LoadingView from "../components/LoadingView";

const MovieDetail = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const { movieDetail, loading, error } = useMovieDetail(Number(movieId));

  // Guard: when route param is not yet ready, show the unified loading view
  const isIdInvalid = !movieId || Number.isNaN(Number(movieId));
  if (isIdInvalid) return <LoadingView message="Loading movie details..." />;

  if (loading) return <LoadingView message="Loading movie details..." />;

  if (error || !movieDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-700 flex items-center justify-center p-5">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-4 text-red-400">Error</h1>
          <h2 className="text-2xl font-semibold mb-4">Movie Not Found</h2>
          <p className="text-lg opacity-90 mb-8">
            영화 정보를 불러올 수 없습니다.
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const getImageUrl = (path: string) => {
    return `${TMDB_CONFIG.IMAGE_BASE_URL}${path}`;
  };

  const getBackdropUrl = (path: string) => {
    return `https://image.tmdb.org/t/p/w1280${path}`;
  };

  const getYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  const getDirectors = () => {
    return movieDetail.credits.crew
      .filter((person) => person.job === "Director")
      .map((person) => person.name)
      .join(", ");
  };

  const getMainCast = () => {
    return movieDetail.credits.cast
      .slice(0, 5)
      .map((actor) => actor.name)
      .join(", ");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-700">
      {/* Backdrop Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={getBackdropUrl(movieDetail.backdrop_path)}
          alt={movieDetail.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/50 to-transparent"></div>

        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-colors duration-200 cursor-pointer"
          >
            ← 뒤로가기
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Movie Poster */}
          <div className="flex-shrink-0">
            <img
              src={getImageUrl(movieDetail.poster_path)}
              alt={movieDetail.title}
              className="w-80 h-auto rounded-xl shadow-2xl"
            />
          </div>

          {/* Movie Details */}
          <div className="flex-1 text-white">
            <h1 className="text-4xl font-bold mb-4">{movieDetail.title}</h1>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <span className="text-yellow-400 text-2xl mr-2">★</span>
              <span className="text-2xl font-semibold">
                {movieDetail.vote_average.toFixed(1)}
              </span>
            </div>

            {/* Movie Info */}
            <div className="mb-6 space-y-2">
              <p className="text-lg">
                <span className="font-semibold">개봉년도:</span>{" "}
                {getYear(movieDetail.release_date)}
              </p>
              <p className="text-lg">
                <span className="font-semibold">상영시간:</span>{" "}
                {movieDetail.runtime}분
              </p>
              <p className="text-lg">
                <span className="font-semibold">장르:</span>{" "}
                {movieDetail.genres.map((genre) => genre.name).join(", ")}
              </p>
            </div>

            {/* Director */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">감독</h3>
              <p className="text-lg">{getDirectors()}</p>
            </div>

            {/* Main Cast */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">주요 출연진</h3>
              <p className="text-lg">{getMainCast()}</p>
            </div>

            {/* Synopsis */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">줄거리</h3>
              <p className="text-lg leading-relaxed opacity-90">
                {movieDetail.overview}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 cursor-pointer">
                <span className="mr-2">▶</span>
                예고편 보기
              </button>
              <button className="flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200 cursor-pointer">
                <span className="mr-2">♡</span>
                찜하기
              </button>
              <button className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 cursor-pointer">
                <span className="mr-2">📤</span>
                공유하기
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Movie Info Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">영화 정보</h3>
            <div className="space-y-2 text-white">
              <p>
                <span className="font-semibold">개봉년도:</span>{" "}
                {getYear(movieDetail.release_date)}
              </p>
              <p>
                <span className="font-semibold">상영시간:</span>{" "}
                {movieDetail.runtime}분
              </p>
              <p>
                <span className="font-semibold">장르:</span>{" "}
                {movieDetail.genres.map((genre) => genre.name).join(", ")}
              </p>
              <p>
                <span className="font-semibold">평점:</span>{" "}
                {movieDetail.vote_average.toFixed(1)}/10
              </p>
            </div>
          </div>

          {/* Crew/Cast Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              제작진 & 출연진
            </h3>
            <div className="space-y-2 text-white">
              <p>
                <span className="font-semibold">감독:</span> {getDirectors()}
              </p>
              <div>
                <span className="font-semibold">출연진:</span>
                <ul className="mt-1 space-y-1">
                  {movieDetail.credits.cast.slice(0, 5).map((actor) => (
                    <li key={actor.id} className="text-sm">
                      {actor.name} ({actor.character})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
