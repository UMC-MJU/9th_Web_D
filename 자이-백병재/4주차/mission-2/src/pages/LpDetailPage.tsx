import { useParams } from 'react-router-dom';
import useGetLpDetail from '../hooks/queries/useGetLpDetail'; 
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorPage from './ErrorPage';
import formatDate from '../utils/formatDate';

export function LpDetailPage() {
  const { lpid } = useParams(); 
  const numericLpId = Number(lpid); 

  const { 
    data: response, 
    isLoading, 
    isError,
  } = useGetLpDetail(numericLpId);

  const lp = response?.data; 

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (isError || !lp) {
    return <ErrorPage />;
  }

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white p-8 pt-28">

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* --- 왼쪽 컬럼 (이미지 + 핵심 정보) --- */}
        <div className="md:col-span-1 flex flex-col gap-4">
          {/* 썸네일 */}
          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="w-full aspect-square object-cover rounded-xl shadow-2xl"
          />
          
          {/* 핵심 정보 박스 */}
          <div className="bg-gray-800 rounded-lg p-5 flex flex-col gap-3 shadow-lg">
            <h1 className="text-3xl font-bold text-white">{lp.title}</h1>
            <p className="text-xl font-medium text-gray-300">{lp.author.name}</p>
            
            {/* 구분선 */}
            <hr className="border-gray-700 my-2" />
            
            {/* 날짜/좋아요 */}
            <div className="space-y-2 text-gray-400">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-300">발매일:</span>
                <span>{formatDate(lp.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-300">좋아요:</span>
                <span className="text-pink-400">♥ {lp.likes.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/*  오른쪽 컬럼 (설명 + 태그) */}
        <div className="md:col-span-2 flex flex-col gap-8">
          
          {/* "LP 소개" 섹션 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-3">
              LP 소개
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-wrap">
              {lp.content}
            </p>
          </div>

          {/* "태그" 섹션 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-3">
              태그
            </h2>
            <div className="flex flex-wrap gap-3">
              {lp.tags.length > 0 ? (
                lp.tags.map((tag: any) => ( 
                  <span 
                    key={tag.id} 
                    className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full"
                  >
                    {tag.name}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">표시할 태그가 없습니다.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LpDetailPage;