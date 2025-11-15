import { useState } from 'react';
import CreateLpModal from '../modals/createLpModal';
import { useCreateLp } from '../hooks/queries/useCreateLp';

export const CreateLpButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const { mutate } = useCreateLp();

  // 모달 닫기 (상태 초기화)
  const closeModalAndReset = () => {
    setIsModalOpen(false);
    setTitle('');
    setContent('');
    setThumbnailUrl('');
    setCurrentTag('');
    setTags([]);
  };

  // 모달 열기
  const openModal = () => setIsModalOpen(true);

  const handleAddTag = () => {
    const newTag = currentTag.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]); 
      setCurrentTag(''); 
    }
  };

  // 태그 삭제 핸들러
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // 최종 제출 핸들러
  const handleSubmit = () => {
    mutate({ title: title, content: content, thumbnail: thumbnailUrl, tags: tags });
    closeModalAndReset(); 
  };

  return (
    <>
      <button
        onClick={openModal}
        className="fixed bottom-8 left-8 z-30 
                   w-16 h-16 rounded-full 
                   bg-[#FFA900] text-white 
                   flex items-center justify-center 
                   text-4xl font-thin shadow-lg hover:bg-[#ffaa00c1] transition-colors"
        aria-label="LP 생성"
      >
        +
      </button>

      {/* 모달 컴포넌트 */}
      <CreateLpModal isOpen={isModalOpen} onClose={closeModalAndReset}>
        
        <h2 className="text-xl font-bold mb-6 text-white">새 LP 생성</h2>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            LP 썸네일 URL
          </label>
          <input 
            type="text" 
            placeholder="https://... 이미지 주소를 붙여넣으세요"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className="w-full rounded border-gray-600 bg-gray-700 p-2 text-white placeholder-gray-400 focus:ring-[#FFA900] focus:border-[#FFA900]"
          />

          {thumbnailUrl && (
            <img 
              src={thumbnailUrl} 
              alt="썸네일 프리뷰" 
              className="mt-2 mx-auto h-32 w-32 object-cover rounded-md" 
              onError={(e) => e.currentTarget.style.display = 'none'} // URL이 잘못되면 숨김
              onLoad={(e) => e.currentTarget.style.display = 'block'}
            />
          )}
        </div>

        <input 
            type="text" 
            placeholder="LP 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border-gray-600 bg-gray-700 p-2 mb-2 text-white placeholder-gray-400 focus:ring-[#FFA900] focus:border-[#FFA900]"
        />
        <textarea 
            placeholder="LP 설명"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded border-gray-600 bg-gray-700 p-2 mb-4 text-white placeholder-gray-400 focus:ring-[#FFA900] focus:border-[#FFA900]"
            rows={4}
        />

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-300">태그</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); }}}
              placeholder="태그 입력 후 '추가'"
              className="flex-grow rounded border-gray-600 bg-gray-700 p-2 text-white placeholder-gray-400 focus:ring-[#FFA900] focus:border-[#ffaa00d5]"
            />
            <button 
              type="button" 
              onClick={handleAddTag}
              className="rounded bg-[#FFA900] px-4 py-2 text-white hover:bg-[#ffaa00d8]"
            >
              추가
            </button>
          </div>
          
          <div className="mt-2 flex min-h-[2.5rem] flex-wrap gap-2 rounded-md border border-gray-600 p-2">
            {tags.map((tag) => (
              <span 
                key={tag} 
                className="flex items-center gap-1.5 rounded-full bg-[#FFA900] px-3 py-1 text-sm text-white"
              >
                {tag}
                <button 
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-[#FFA900] hover:text-white"
                  aria-label={`Remove ${tag} tag`}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* 모달 푸터 버튼 */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={closeModalAndReset}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#FFA900] text-white rounded-lg hover:bg-[#ffaa00cd]"
          >
            생성
          </button>
        </div>

      </CreateLpModal>
    </>
  );
};