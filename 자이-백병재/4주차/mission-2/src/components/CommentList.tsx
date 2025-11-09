import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import LpListSkeleton from './LpListSkeleton';
import type { CommentResponseDto } from '../types/comment'; // (타입 경로는 실제 위치에 맞게 수정)
import { useGetInfiniteCommentList } from '../hooks/queries/useGetInfinityCommentList';

export function CommentList({ id }: { id: number }) {
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');
  const {
    data: comments,
    hasNextPage,
    isPending,
    isFetching,
    fetchNextPage,
    isError,
  } = useGetInfiniteCommentList({
    lpId: id,
    limit: 30,
    order: order,
  });
 

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  if (isPending) {
    return (
      <div className="w-full min-h-screen">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 m-5">
          <LpListSkeleton count={12} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <p className="text-red-400">댓글을 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  // 데이터 가공
  const allComments: CommentResponseDto[] =
    comments?.pages?.map((page) => page.data.data)?.flat() || [];

  return (
    // 전체를 감싸는 div
    <div className="w-full min-h-screen">
      {/* 정렬 */}
      <div className="col-span-full flex justify-end gap-2 mb-4 mr-10">
        <button
          onClick={() => setOrder('desc')}
          className={`px-3 py-1 text-sm rounded-md transition-colors
                ${
                  order === 'desc'
                    ? 'bg-[#FFA900] text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
        >
          최신순
        </button>
        <button
          onClick={() => setOrder('asc')}
          className={`px-3 py-1 text-sm rounded-md transition-colors
                ${
                  order === 'asc'
                    ? 'bg-[#FFA900] text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
        >
          오래된순
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 m-5">
        {allComments.map((comment) => (
          <h1 key={comment.id}>{comment.content}</h1>
        ))}
        {/* isFetching && !isPending일 때만 '다음 페이지 로딩' 스켈레톤 표시 + 수정 필요 */}
        {isFetching && !isPending && <LpListSkeleton count={12} />}
      </div>

      {!isPending && !isFetching && allComments.length === 0 && (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">아직 등록된 댓글이 없습니다.</p>
        </div>
      )}

      {hasNextPage && <div ref={ref} className="h-20" />}
    </div>
  );
}

export default CommentList;