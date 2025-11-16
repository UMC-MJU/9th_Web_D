import { useState, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../apis';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../utils/auth';
import { tokenStorage } from '../../lib/token';

type MeResponse = {
  data: {
    id: number;
    email: string;
    name: string | null;
    bio: string | null;
    avatar: string | null;
  };
};

const MemberPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [preview, setPreview] = useState<string>('');
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await api.get<MeResponse>('/users/me');
      return res.data.data;
    },
    staleTime: 30 * 1000,
  });

  const { mutate: uploadAvatar, isPending: uploading } = useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append('file', file);
      const res = await api.post('/uploads', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data?.data?.imageUrl ?? res.data?.imageUrl;
    },
    onSuccess: (url) => {
      if (url) setAvatar(url);
    },
  });

  const { mutate: updateMe, isPending: saving } = useMutation({
    mutationFn: async (payload: { name?: string; bio?: string; avatar?: string }) => {
      const res = await api.patch('/users', payload);
      return res.data;
    },
    // 낙관적 업데이트: 서버 응답 전 닉네임/소개를 즉시 반영
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['me'] });
      const previousMe = queryClient.getQueryData<any>(['me']);

      // 캐시 업데이트
      queryClient.setQueryData(['me'], (old: any) => {
        const current = old ?? {};
        return {
          ...current,
          name: payload.name ?? current.name,
          bio: payload.bio ?? current.bio,
          avatar: payload.avatar ?? current.avatar,
        };
      });

      // NavBar 갱신을 위해 로컬 스토리지의 닉네임 동기화
      let previousUserInfo: any = null;
      try {
        const stored = localStorage.getItem('userInfo');
        previousUserInfo = stored ? JSON.parse(stored) : null;
        if (payload.name) {
          const next = { ...(previousUserInfo ?? {}), nickname: payload.name };
          localStorage.setItem('userInfo', JSON.stringify(next));
          // Same-tab 갱신 이벤트
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth-changed'));
          }
        }
      } catch {
        // noop
      }

      return { previousMe, previousUserInfo };
    },
    onError: (_err, _payload, context) => {
      // 롤백
      if (context?.previousMe) {
        queryClient.setQueryData(['me'], context.previousMe);
      }
      try {
        if (context?.previousUserInfo) {
          localStorage.setItem('userInfo', JSON.stringify(context.previousUserInfo));
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth-changed'));
          }
        }
      } catch {
        // noop
      }
    },
    onSuccess: () => {
      setEditing(false);
      setPreview('');
      refetch();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const openPicker = () => fileRef.current?.click();
  const onPick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPreview(URL.createObjectURL(f));
    uploadAvatar(f);
    e.currentTarget.value = '';
  };

  // 회원 탈퇴
  const { mutate: deleteMe, isPending: deleting } = useMutation({
    mutationFn: async () => {
      const res = await api.delete('/users');
      return res.data;
    },
    onSuccess: () => {
      // 클라이언트 상태 초기화
      logout();
      tokenStorage.clear();
      queryClient.clear();
      navigate('/login', { replace: true });
    },
  });

  if (isLoading || !data) {
    return (
      <div className="p-8">
        <div className="h-48 rounded-xl bg-gray-200 animate-pulse" />
      </div>
    );
  }

  const avatarUrl = preview || avatar || data.avatar || '';

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">마이페이지</h1>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
            onClick={() => {
              if (!editing) {
                setEditing(true);
                setName(data.name ?? '');
                setBio(data.bio ?? '');
                setAvatar(data.avatar ?? '');
              } else {
                setEditing(false);
                setPreview('');
              }
            }}
          >
            {editing ? '닫기' : '설정'}
          </button>
          <button
            className="px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
            onClick={() => setConfirmOpen(true)}
          >
            탈퇴하기
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-white text-gray-900 p-6 flex items-center gap-6 border">
        <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center ring-1 ring-gray-300">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
              <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" fill="currentColor"/>
            </svg>
          )}
        </div>

        <div className="flex-1 space-y-3">
          <div className="text-gray-600 text-sm">{data.email}</div>
          {editing ? (
            <div className="space-y-2">
              <input
                className="w-full h-10 rounded bg-white border border-gray-300 px-3 text-gray-900"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="w-full h-10 rounded bg-white border border-gray-300 px-3 text-gray-900"
                placeholder="본인을 소개해보세요(선택)"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 text-gray-900"
                  onClick={openPicker}
                >
                  프로필 사진 선택
                </button>
                <input ref={fileRef} className="hidden" type="file" accept="image/*" onChange={onPick} />
                {uploading && <span className="text-xs text-gray-500">업로드 중...</span>}
              </div>
            </div>
          ) : (
            <>
              <div className="text-lg font-semibold">{data.name ?? '이름 없음'}</div>
              {data.bio && <div className="text-sm text-gray-600">{data.bio}</div>}
            </>
          )}
        </div>

        {editing ? (
          <button
            className="px-3 py-2 rounded bg-black text-white hover:bg-gray-800"
            onClick={() => updateMe({ name, bio, avatar })}
            disabled={saving}
          >
            저장
          </button>
        ) : null}
      </div>

      {/* 탈퇴 확인 모달 */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-sm rounded-lg bg-white shadow-xl"
          >
            <div className="p-4 flex items-center justify-between">
              <h3 className="font-semibold">회원 탈퇴</h3>
              <button className="p-1 rounded hover:bg-gray-100" onClick={() => setConfirmOpen(false)}>✕</button>
            </div>
            <div className="p-4 text-sm text-gray-700">
              정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </div>
            <div className="p-3 flex items-center justify-end gap-2">
              <button
                className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-100"
                onClick={() => setConfirmOpen(false)}
              >
                아니오
              </button>
              <button
                className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-500 disabled:bg-red-300"
                onClick={() => deleteMe()}
                disabled={deleting}
              >
                {deleting ? '처리 중...' : '예'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberPage;