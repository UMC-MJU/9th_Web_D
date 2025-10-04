interface ErrorPageProps {
  onGoHome: () => void;
}

const ErrorPage = ({ onGoHome }: ErrorPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-700 flex items-center justify-center p-5">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4 text-red-400">Error</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Limit Exceeded</h2>
        <p className="text-lg opacity-90 mb-8">
          이 페이지는 접근할 수 없습니다. 최대 10페이지까지만 조회 가능합니다.
        </p>
        <button
          onClick={onGoHome}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 cursor-pointer"
        >
          첫 페이지로 이동
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
