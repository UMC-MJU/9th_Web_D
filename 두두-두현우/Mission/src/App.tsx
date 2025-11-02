import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import NameEnterModal from "./components/NameEnterModal";
import HomePage from "./pages/HomePage";
import MyPage from "./pages/MyPage";
import NotFoundPage from "./pages/NotFoundPage";
import { STORAGE_KEYS } from "./constants";

function App() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [signupData, setSignupData] = useState<{
    email: string;
    password: string;
  } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 초기 로드 시 localStorage에서 로그인 상태 복원
  useEffect(() => {
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    if (accessToken) {
      // TODO: 실제로는 토큰 유효성 검증 API 호출 필요
      // 예: GET /v1/users/me 를 호출하여 사용자 정보 가져오기
      setIsLoggedIn(true);

      const savedUsername = localStorage.getItem(STORAGE_KEYS.USERNAME);
      if (savedUsername) {
        setUsername(savedUsername);
      }
    }

    setIsLoading(false);
  }, []);

  // 구글 로그인 콜백 처리
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const name = params.get("name");

    // 구글 로그인 성공 시 토큰이 URL 파라미터로 전달됨
    if (accessToken && refreshToken && name) {
      // 토큰을 localStorage에 저장
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      localStorage.setItem(STORAGE_KEYS.USERNAME, name);

      // 로그인 상태 업데이트
      setUsername(name);
      setIsLoggedIn(true);

      // 홈으로 리다이렉트
      navigate("/", { replace: true });
    }
  }, [location.search, navigate]);

  const handleLoginSuccess = (username: string) => {
    setUsername(username);
    setIsLoggedIn(true);
    // username을 localStorage에 저장
    localStorage.setItem(STORAGE_KEYS.USERNAME, username);
  };

  const handleSignUpStart = (email: string, password: string) => {
    setSignupData({ email, password });
    // SignUpModal에서 이미 /enter-name으로 라우팅됨
  };

  const handleSignUpSuccess = (username: string) => {
    setUsername(username);
    setIsLoggedIn(true);
    setSignupData(null);
    // username을 localStorage에 저장
    localStorage.setItem(STORAGE_KEYS.USERNAME, username);
  };

  const handleLogout = () => {
    // 로그아웃 시 토큰 및 사용자 정보 삭제
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USERNAME);

    // 홈으로 리다이렉트 (상태 변경 전에 먼저 이동)
    navigate("/");

    // 상태 업데이트
    setIsLoggedIn(false);
    setUsername("");
  };

  const layoutProps = {
    username,
    isLoggedIn,
    onLoginSuccess: handleLoginSuccess,
    onLogout: handleLogout,
    onSignUpStart: handleSignUpStart,
  };

  // 초기 로딩 중에는 빈 화면 표시
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Layout이 필요한 페이지들 */}
      <Route element={<Layout {...layoutProps} />}>
        <Route path="/" element={<HomePage username={username} />} />
        <Route path="/me" element={<MyPage isLoggedIn={isLoggedIn} />} />
      </Route>

      {/* Layout이 필요없는 페이지들 */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route
        path="/enter-name"
        element={
          signupData ? (
            <NameEnterModal
              isOpen={location.pathname === "/enter-name"}
              onClose={() => {}}
              email={signupData.email}
              password={signupData.password}
              onSignUpSuccess={handleSignUpSuccess}
            />
          ) : null
        }
      />

      {/* 존재하지 않는 모든 경로 → 404 페이지 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
