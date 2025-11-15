import React, { Dispatch, SetStateAction } from 'react';

// Props 타입 정의
interface LpFormProps {
    title: string;
    setTitle: (title: string) => void;
    content: string;
    setContent: (content: string) => void;
    thumbnailUrl: string;
    setThumbnailUrl: (url: string) => void;
    currentTag: string;
    setCurrentTag: Dispatch<SetStateAction<string>>;
    tags: string[];
    handleAddTag: () => void;
    handleRemoveTag: (tag: string) => void;
}

const LpForm: React.FC<LpFormProps> = ({
    title, setTitle,
    content, setContent,
    thumbnailUrl, setThumbnailUrl,
    currentTag, setCurrentTag,
    tags, handleAddTag, handleRemoveTag
}) => {
    return (
        <>
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
                        onError={(e) => e.currentTarget.style.display = 'none'} 
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
        </>
    );
};

export default LpForm;