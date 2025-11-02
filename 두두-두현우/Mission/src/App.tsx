import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./Layout";
import NameEnterModal from "./components/NameEnterModal";
import HomePage from "./pages/HomePage";
import MyPage from "./pages/MyPage";
import NotFoundPage from "./pages/NotFoundPage";
import { STORAGE_KEYS } from "./constants";

function App() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [signupData, setSignupData] = useState<{
    email: string;
    password: string;
  } | null>(null);
  const location = useLocation();

  const handleLoginSuccess = (username: string) => {
    setUsername(username);
    setIsLoggedIn(true);
  };

  const handleSignUpStart = (email: string, password: string) => {
    setSignupData({ email, password });
    // SignUpModal에서 이미 /enter-name으로 라우팅됨
  };

  const handleSignUpSuccess = (username: string) => {
    setUsername(username);
    setIsLoggedIn(true);
    setSignupData(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    // 로그아웃 시 토큰 삭제
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  };

  const layoutProps = {
    username,
    isLoggedIn,
    onLoginSuccess: handleLoginSuccess,
    onLogout: handleLogout,
    onSignUpStart: handleSignUpStart,
  };

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
