import { useState } from 'react';
import CreateLpModal from '../modals/createLpModal';
import { useCreateLp } from '../hooks/queries/useCreateLp';
import LpForm from './LpForm';

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
                <LpForm
                    title={title}
                    setTitle={setTitle}
                    content={content}
                    setContent={setContent}
                    thumbnailUrl={thumbnailUrl}
                    setThumbnailUrl={setThumbnailUrl}
                    currentTag={currentTag}
                    setCurrentTag={setCurrentTag}
                    tags={tags}
                    handleAddTag={handleAddTag}
                    handleRemoveTag={handleRemoveTag}
                />

                {/* 모달 버튼 */}
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