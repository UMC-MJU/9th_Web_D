import { useState } from "react";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignup: (email: string, password: string, confirmPassword: string) => void;
}

export default function SignUpModal({
  isOpen,
  onClose,
  onSignup,
}: SignUpModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !confirmPassword) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length <= 8) {
      setError("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    onSignup(email, password, confirmPassword);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 cursor-pointer"
        onClick={handleClose}
      />
      <div className="relative backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl max-w-md w-full mx-4 p-8">
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/70 hover:text-white cursor-pointer"
        >
          <i className="ri-close-line text-xl"></i>
        </button>

        {/* 제목 */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">회원가입</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-red-300 text-sm flex items-center justify-center space-x-1">
              <i className="ri-error-warning-line text-xs"></i>
              <span>{error}</span>
            </div>
          )}

          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 backdrop-blur-md bg-black/20 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent text-sm transition-all duration-300"
              placeholder="이메일을 입력하세요"
              required
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 backdrop-blur-md bg-black/20 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent text-sm transition-all duration-300"
              placeholder="비밀번호를 입력하세요 (최소 6자)"
              required
            />
          </div>

          <div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 backdrop-blur-md bg-black/20 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent text-sm transition-all duration-300"
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-white text-black font-semibold rounded-2xl whitespace-nowrap hover:bg-white/90 transition-all duration-300 cursor-pointer"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}
