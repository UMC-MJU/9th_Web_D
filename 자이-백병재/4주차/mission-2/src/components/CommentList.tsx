import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import type { CommentResponseDto } from '../types/comment';
import { useGetInfiniteCommentList } from '../hooks/queries/useGetInfinityCommentList'; 
import { useCreateComment } from '../hooks/queries/useCreateComment';

export function CommentList({ id }: { id: number }) {
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');
  const [newComment, setNewComment] = useState('');
  
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

  const createCommentMutation = useCreateComment(id); // useMutation의 결과 반환(mutate 함수와 isPending 상태)

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  // '등록' 버튼 클릭 시 실행되는 함수
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!newComment.trim()) return; 

    // 여기서 실제 api 보냄
    createCommentMutation.mutate(
      { lpId: id, content: newComment },
      {
        onSuccess: () => {
          setNewComment(''); // 성공 시 입력창 비우기
        },
      }
    );
  };

  // 로딩 상태 (목록 가져오기)
  if (isPending) {
    return (
      <div className="w-full space-y-4">
        <div className="p-4 bg-gray-800 rounded-lg shadow animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-3"></div>
          <div className="h-5 bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    );
  }

  // 에러 상태 (목록 가져오기)
  if (isError) {
    return (
      <div className="w-full flex justify-center items-center py-10">
        <p className="text-red-400">댓글을 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  // 데이터 가공
  const allComments: CommentResponseDto[] =
    comments?.pages?.map((page) => page.data.data)?.flat() || [];

  return (
    <div className="w-full">
      {/* 댓글 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-white">댓글</h2>
      </div>

      {/* 댓글 작성 폼 */}
      <form onSubmit={handleCommentSubmit} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-3 bg-gray-700 text-gray-300 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFA900] disabled:opacity-50"
          rows={3}
          placeholder="댓글을 입력하세요..."
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-[#FFA900] text-white text-sm font-semibold rounded-lg hover:bg-opacity-80 transition-colors disabled:opacity-50" 
            disabled={!newComment.trim() || createCommentMutation.isPending} 
          >
            {createCommentMutation.isPending ? '등록 중...' : '등록'}
          </button>
        </div>
      </form>

      {/* 정렬 버튼 */}
      <div className="col-span-full flex justify-end gap-2 mb-4">
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

      {/* 댓글 목록 */}
      <div className="flex flex-col gap-4">
        {allComments.map((comment) => (
          <div 
            key={comment.id}
            className="p-4 bg-gray-800 rounded-lg shadow"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-white">
                {comment.author?.name || '익명'}
              </span>
              <span className="text-sm text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <hr className="border-gray-700 my-2" />

            <p className="text-gray-300 whitespace-pre-wrap">{comment.content}</p>
          </div>
        ))}
        
        {/* 다음 페이지 로딩 스켈레톤 */}
        {isFetching && !isPending && (
          <div className="p-4 bg-gray-800 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/4 mb-3"></div>
            <div className="h-5 bg-gray-700 rounded w-full"></div>
          </div>
        )}
      </div>

      {/* 데이터가 없는 경우 */}
      {!isPending && !isFetching && allComments.length === 0 && (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">아직 등록된 댓글이 없습니다.</p>
        </div>
      )}

      {/* 무한 스크롤 감지 영역 */}
      {hasNextPage && <div ref={ref} className="h-20" />}
    </div>
  );
}

export default CommentList;