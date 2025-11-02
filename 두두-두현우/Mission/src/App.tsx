import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./Layout";
import NameEnterModal from "./components/NameEnterModal";
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

  return (
    <>
      <Layout
        username={username}
        isLoggedIn={isLoggedIn}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        onSignUpStart={handleSignUpStart}
      >
        <div className="flex items-center justify-center min-h-screen">
          <h1 className="text-4xl font-bold text-white">
            {username ? `Welcome, ${username}!` : "Welcome"}
          </h1>
        </div>
      </Layout>
      <Routes>
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
      </Routes>
    </>
  );
}

export default App;
