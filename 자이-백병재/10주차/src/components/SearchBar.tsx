import { memo, useState } from "react";

interface SearchBarProps {
  onSearch: (query: string, includeAdult: boolean, language: string) => void;
}

export const SearchBar = memo(({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState("ko-KR");

  const handleSearch = () => {
    onSearch(query, includeAdult, language);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="bg-slate-50 rounded-xl p-6 mb-10 border border-slate-200">
      
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-bold text-gray-700 mb-2">🎬 영화 제목</label>
          <input
            type="text"
            placeholder="영화 제목을 입력하세요"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="w-full md:w-48">
           <label className="block text-sm font-bold text-gray-700 mb-2">🌐 언어</label>
           <select
             value={language}
             onChange={(e) => setLanguage(e.target.value)}
             className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
           >
             <option value="ko-KR">한국어</option>
             <option value="en-US">English</option>
             <option value="ja-JP">日本語</option>
           </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer select-none hover:bg-slate-100 p-2 rounded-lg transition-colors">
          <input
            type="checkbox"
            checked={includeAdult}
            onChange={(e) => setIncludeAdult(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-gray-700 font-semibold">성인 콘텐츠 표시</span>
        </label>
        <button
          onClick={handleSearch}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          🔍 검색하기
        </button>
      </div>
    </div>
  );
});