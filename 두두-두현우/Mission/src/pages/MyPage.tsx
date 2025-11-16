import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMe, updateUser } from "../apis/users";
import { STORAGE_KEYS } from "../constants";
import { uploadImage } from "../apis/uploads";

interface MyPageProps {
  isLoggedIn: boolean;
}

const MyPage = ({ isLoggedIn }: MyPageProps) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
  } | null>(null);
  const [editing, setEditing] = useState<{ name: boolean; bio: boolean }>({
    name: false,
    bio: false,
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // 로그인하지 않은 상태에서 접근 시 404로 리다이렉트
    if (!isLoggedIn) {
      navigate("/404", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (!isLoggedIn) return;
    let mounted = true;
    const load = async () => {
      try {
        setStatus("loading");
        setError(null);
        const me = await fetchMe();
        if (!mounted) return;
        setProfile(me);
        // 구글 로그인으로 들어온 경우 name만 저장되어 있을 수 있으니 업데이트
        if (me.name) localStorage.setItem(STORAGE_KEYS.USERNAME, me.name);
        setStatus("success");
      } catch {
        if (!mounted) return;
        setError("프로필 정보를 불러오지 못했습니다.");
        setStatus("error");
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, [isLoggedIn]);

  const saveField = async (partial: { name?: string; bio?: string | null }) => {
    if (!profile) return;
    try {
      setBusy(true);
      const updated = await updateUser(partial);
      setProfile(updated);
      if (updated.name)
        localStorage.setItem(STORAGE_KEYS.USERNAME, updated.name);
    } catch {
      // 무음 처리 + 스낵바가 없다 보니 간단 안내
      alert("수정에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setBusy(false);
    }
  };

  const onAvatarClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !profile) return;
      try {
        setBusy(true);
        const imageUrl = await uploadImage(file);
        const updated = await updateUser({ avatar: imageUrl });
        setProfile(updated);
      } catch {
        alert("프로필 사진 업데이트에 실패했습니다.");
      } finally {
        setBusy(false);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-semibold">My Page</h1>
        {status === "loading" && (
          <div className="mt-10 text-white/70">프로필을 불러오는 중...</div>
        )}
        {status === "error" && (
          <div className="mt-10 text-red-400">{error}</div>
        )}
        {status === "success" && profile && (
          <div className="mt-10 flex items-start gap-6">
            <button
              type="button"
              onClick={onAvatarClick}
              className="h-28 w-28 overflow-hidden rounded-full border border-white/10 bg-white/5 cursor-pointer"
              title="프로필 사진 변경"
            >
              <img
                src={
                  profile.avatar ||
                  "https://api.dicebear.com/7.x/initials/svg?seed=" +
                    encodeURIComponent(profile.name || "User")
                }
                alt="avatar"
                className="h-full w-full object-cover"
              />
            </button>
            <div>
              {editing.name ? (
                <input
                  autoFocus
                  defaultValue={profile.name}
                  onBlur={(e) => {
                    setEditing((prev) => ({ ...prev, name: false }));
                    const next = e.target.value.trim();
                    if (next && next !== profile.name) {
                      void saveField({ name: next });
                    }
                  }}
                  className="text-xl font-semibold bg-transparent border-b border-white/30 focus:outline-none"
                  disabled={busy}
                />
              ) : (
                <div
                  className="text-xl font-semibold cursor-pointer"
                  onClick={() =>
                    setEditing((prev) => ({ ...prev, name: true }))
                  }
                  title="이름 수정"
                >
                  {profile.name}
                </div>
              )}
              <div className="text-white/60 text-sm">{profile.email}</div>
              {editing.bio ? (
                <textarea
                  autoFocus
                  defaultValue={profile.bio ?? ""}
                  rows={3}
                  onBlur={(e) => {
                    setEditing((prev) => ({ ...prev, bio: false }));
                    const next = e.target.value.trim();
                    const normalized = next.length ? next : null;
                    if (normalized !== (profile.bio ?? null)) {
                      void saveField({ bio: normalized });
                    }
                  }}
                  className="mt-3 w-full resize-none rounded-xl border border-white/20 bg-black/30 p-3 text-white/80 focus:outline-none focus:border-white/40"
                  disabled={busy}
                />
              ) : (
                <div
                  className="mt-3 whitespace-pre-wrap text-white/80 cursor-pointer"
                  onClick={() => setEditing((prev) => ({ ...prev, bio: true }))}
                  title="소개 수정"
                >
                  {profile.bio || "소개가 없습니다. 클릭하여 작성하세요."}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;
