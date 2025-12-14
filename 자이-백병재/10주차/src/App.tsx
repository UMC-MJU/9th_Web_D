import { MovieList } from "./components/MovieList";

function App() {
  // 검색창이 없으므로, 여기서 파라미터를 직접 지정합니다.
  const searchParams = {
    query: "주토피아",      // 검색어 고정
    include_adult: false,
    language: "ko-KR",     // 한국어 설정
  };

  return (
    // 배경: 연한 회색 (bg-gray-100)
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-start">
      
      {/* 메인 컨테이너: 흰색 배경 + 진한 그림자 */}
      <div className="w-full max-w-7xl bg-white shadow-2xl rounded-3xl p-8 md:p-12">
        
        {/* 타이틀 */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
             Movie Finder
          </h1>
          <p className="text-slate-500 mt-2">지정한 검색어 결과입니다: {searchParams.query}</p>
        </header>

        {/* 구분선 */}
        <div className="w-full h-px bg-gray-200 my-10"></div>

        {/* 영화 목록 컴포넌트에 고정된 파라미터 전달 */}
        <MovieList searchParams={searchParams} />
        
      </div>
    </div>
  );
}

export default App;