import { useCallback, useState } from "react";
import { SearchBar } from "./components/SearchBar";
import { MovieList } from "./components/MovieList";

function App() {
  const [searchParams, setSearchParams] = useState({
    query: "", 
    include_adult: false,
    language: "ko-KR",
  });

  // [최적화] 이 함수가 재생성되지 않아야 SearchBar도 리렌더링을 막을 수 있음
  const handleSearch = useCallback((query: string, includeAdult: boolean, language: string) => {
    setSearchParams({
      query,
      include_adult: includeAdult,
      language,
    });
  }, []);

  return (
    // 1. 전체 페이지 배경: 연한 회색 (bg-gray-100)
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-start">
      
      {/* 2. 메인 컨테이너: 흰색 배경 + 진한 그림자 (bg-white shadow-2xl) */}
      <div className="w-full max-w-7xl bg-white shadow-2xl rounded-3xl p-8 md:p-12 transition-all">
        
        {/* 타이틀 */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
             Movie Finder
          </h1>
          <p className="text-slate-500 mt-2">원하는 영화를 검색하고 정보를 확인하세요</p>
        </header>

        {/* 검색창 */}
        <SearchBar onSearch={handleSearch} />

        {/* 구분선 */}
        <div className="w-full h-px bg-gray-200 my-10"></div>

        {/* 영화 목록 */}
        <MovieList searchParams={searchParams} />
        
      </div>
    </div>
  );
}

export default App;