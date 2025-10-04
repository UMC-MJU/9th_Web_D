import { useState } from "react";
import { useMovies } from "../hooks/useMovies";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";
import ErrorPage from "./ErrorPage";

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { movies, loading, error } = useMovies(currentPage);

  // 11페이지 접근 시 에러 처리
  if (currentPage === 11) {
    return <ErrorPage onGoHome={() => setCurrentPage(1)} />;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-5"></div>
        <p className="text-lg">Loading movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white text-center">
        <h2 className="text-red-400 text-2xl mb-2">Error loading movies</h2>
        <p className="text-lg opacity-90">{error}</p>
      </div>
    );
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 페이지 변경 시 스크롤을 맨 위로 이동
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-700 p-5">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Popular Movies
        </h1>

        {/* 페이지네이션 (상단) */}
        {movies && (
          <Pagination
            currentPage={currentPage}
            totalPages={movies.total_pages}
            onPageChange={handlePageChange}
          />
        )}

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {movies?.results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </main>

        {/* 페이지네이션 (하단) */}
        {movies && (
          <Pagination
            currentPage={currentPage}
            totalPages={movies.total_pages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
