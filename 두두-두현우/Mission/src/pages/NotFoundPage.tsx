import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 숫자 */}
        <div className="relative mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 text-8xl md:text-9xl font-bold text-white/10 blur-sm">
            404
          </div>
        </div>

        {/* 메인 메시지 */}
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
          페이지를 찾을 수 없습니다
        </h2>

        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
          요청하신 페이지가 존재하지 않거나
          <br />
          이동되었을 수 있습니다
        </p>

        {/* 버튼들 */}
        <div className="space-y-4">
          <button
            onClick={handleGoHome}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg whitespace-nowrap cursor-pointer"
          >
            <i className="ri-home-line mr-2"></i>
            홈으로 돌아가기
          </button>

          <button
            onClick={handleGoBack}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg border border-white/20 transition-all duration-300 hover:border-white/40 whitespace-nowrap cursor-pointer"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            이전 페이지로
          </button>
        </div>
      </div>
    </div>
  );
}
