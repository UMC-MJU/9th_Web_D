import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./Layout";
import NameEnterModal from "./components/NameEnterModal";

function App() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  const handleNameSubmit = (name: string) => {
    setUsername(name);
    setIsLoggedIn(true);
  };

  const handleLogin = (email: string, password: string) => {
    console.log("로그인 정보:", email, password);
    // 실제 앱에서는 여기서 인증 처리를 합니다.
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
  };

  return (
    <>
      <Layout
        username={username}
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
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
            <NameEnterModal
              isOpen={location.pathname === "/enter-name"}
              onClose={() => {}}
              onNameSubmit={handleNameSubmit}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
