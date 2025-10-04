interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  // 최대 11페이지까지 허용 (11페이지는 에러 페이지)
  const maxPages = Math.min(totalPages, 11);
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < maxPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  // 페이지 번호 배열 생성 (현재 페이지 주변 5개)
  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(maxPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 py-6">
      {/* 이전 버튼 */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
          currentPage === 1
            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
            : "bg-gray-800 text-white hover:bg-gray-700 cursor-pointer"
        }`}
      >
        이전
      </button>

      {/* 첫 페이지 */}
      {currentPage > 3 && (
        <>
          <button
            onClick={() => handlePageClick(1)}
            className="px-3 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
          >
            1
          </button>
          {currentPage > 4 && <span className="text-gray-400 px-2">...</span>}
        </>
      )}

      {/* 페이지 번호들 */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
            page === currentPage
              ? "bg-blue-600 text-white cursor-pointer"
              : "bg-gray-800 text-white hover:bg-gray-700 cursor-pointer"
          }`}
        >
          {page}
        </button>
      ))}

      {/* 마지막 페이지 */}
      {currentPage < maxPages - 2 && (
        <>
          {currentPage < maxPages - 3 && (
            <span className="text-gray-400 px-2">...</span>
          )}
          <button
            onClick={() => handlePageClick(maxPages)}
            className="px-3 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
          >
            {maxPages}
          </button>
        </>
      )}

      {/* 다음 버튼 */}
      <button
        onClick={handleNext}
        disabled={currentPage === maxPages}
        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
          currentPage === maxPages
            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
            : "bg-gray-800 text-white hover:bg-gray-700 cursor-pointer"
        }`}
      >
        다음
      </button>
    </div>
  );
};

export default Pagination;
