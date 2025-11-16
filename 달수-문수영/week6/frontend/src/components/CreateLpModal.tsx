import { useState, useMemo, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../apis';
import { isLoggedIn } from '../utils/auth';

interface CreateLpModalProps {
  open: boolean;
  onClose: () => void;
}

interface CreateLpBody {
  title: string;
  content: string;
  thumbnail?: string;
  tags: string[];
  published: boolean;
}

export default function CreateLpModal({ open, onClose }: CreateLpModalProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [published, setPublished] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isValid = useMemo(() => {
    return title.trim().length > 0 && content.trim().length > 0 && tags.length > 0;
  }, [title, content, tags]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (body: CreateLpBody) => {
      const res = await api.post('/lps', body);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      resetAndClose();
    },
  });

  const handleAddTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (tags.includes(t)) {
      setTagInput('');
      return;
    }
    setTags((prev) => [...prev, t]);
    setTagInput('');
  };

  const handleRemoveTag = (t: string) => {
    setTags((prev) => prev.filter((x) => x !== t));
  };

  const handleSubmit = () => {
    if (!isLoggedIn()) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!isValid) {
      alert('제목, 내용, 태그를 입력해주세요.');
      return;
    }
    const body: CreateLpBody = {
      title: title.trim(),
      content: content.trim(),
      thumbnail: thumbnail.trim() || undefined,
      tags,
      published,
    };
    mutate(body);
  };

  const resetAndClose = () => {
    setTitle('');
    setContent('');
    setThumbnail('');
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
    setTagInput('');
    setTags([]);
    setPublished(true);
    onClose();
  };

  if (!open) return null;

  // 파일 선택 트리거
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // 파일 변경 시 업로드 및 미리보기
  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // 로컬 미리보기
    const localUrl = URL.createObjectURL(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(localUrl);
    try {
      const form = new FormData();
      form.append('file', file);
      const { data } = await api.post('/uploads', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // 래핑 여부 대응
      const uploadedUrl: string =
        data?.data?.imageUrl ?? data?.imageUrl ?? '';
      if (uploadedUrl) {
        setThumbnail(uploadedUrl);
      }
    } catch (err) {
      alert('이미지 업로드에 실패했습니다. 다시 시도해 주세요.');
      // 실패 시 미리보기도 초기화
      URL.revokeObjectURL(localUrl);
      setPreviewUrl('');
    } finally {
      // 동일 파일 재업로드 가능하도록 초기화
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={resetAndClose}
        aria-label="모달 배경"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="absolute left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#2b2f36] text-gray-100 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          <div className="flex items-start justify-end">
            <button
              type="button"
              aria-label="모달 닫기"
              className="p-1 rounded hover:bg-white/10"
              onClick={resetAndClose}
            >
              ✕
            </button>
          </div>
          <div className="mx-auto mb-2 flex items-center justify-center">
            {/* 업로드 미리보기 */}
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="업로드 미리보기"
                className="w-36 h-36 object-cover rounded-md z-10"
                onClick={openFilePicker}
              />
            ) : null}
            {/* LP 디스크 (클릭 시 파일 선택) */}
            <button
              type="button"
              aria-label="LP 이미지 선택"
              onClick={openFilePicker}
              className={`relative w-36 h-36 rounded-full focus:outline-none focus:ring-2 focus:ring-white/30 ${previewUrl ? '-ml-6' : ''}`}
            >
              <div className="absolute inset-0 rounded-full bg-linear-to-br from-gray-700 to-black shadow-inner" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-200" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-black" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <div className="px-4 pb-4 space-y-3">
          <div>
            <label className="block text-xs text-gray-300 mb-1">LP Name</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-600 bg-[#3a3f46] rounded px-3 py-2 text-sm placeholder-gray-400 text-gray-100"
              placeholder="제목을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-300 mb-1">LP Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-28 border border-gray-600 bg-[#3a3f46] rounded px-3 py-2 text-sm placeholder-gray-400 text-gray-100"
              placeholder="내용을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-300 mb-1">LP Tag</label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="flex-1 border border-gray-600 bg-[#3a3f46] rounded px-3 py-2 text-sm placeholder-gray-400 text-gray-100"
                placeholder="태그 입력 후 추가"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 text-sm rounded bg-gray-500 text-white hover:bg-gray-400 transition-colors"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <li key={t} className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-800 border flex items-center gap-1">
                    <span className="font-medium">#{t}</span>
                    <button
                      type="button"
                      aria-label={`${t} 태그 제거`}
                      className="hover:text-red-600"
                      onClick={() => handleRemoveTag(t)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="p-4 border-t border-gray-700 flex items-center justify-end gap-2">
          <button
            type="button"
            disabled={!isValid || isPending}
            className="px-45 py-2 text-sm rounded bg-gray-500 text-white hover:bg-gray-400 disabled:bg-gray-600"
            onClick={handleSubmit}
          >
            {isPending ? '등록 중...' : 'Add LP'}
          </button>
        </div>
      </div>
    </div>
  );
}


