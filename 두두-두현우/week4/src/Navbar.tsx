import { useState } from "react";
import LoginModal from "./components/LoginModal";
import SignUpModal from "./components/SignUpModal";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLogin = (email: string, password: string) => {
    // 로그인 로직 구현
    console.log("로그인:", email, password);
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  const handleSignup = (
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    // 회원가입 로직 구현
    console.log("회원가입:", email, password, confirmPassword);
    setIsSignupModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleGoogleLogin = () => {
    // 구글 소셜 로그인 로직
    console.log("구글 로그인");
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  return (
    <>
      {/* 메인 네비게이션 - 중앙 상단 */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* 배경 */}
          <div
            className={`
            backdrop-blur-md bg-white/20 border border-white/30 rounded-full shadow-lg
            transition-all duration-500 ease-out px-4 py-3
            ${isHovered ? "w-80" : "w-16"}
          `}
          >
            <div className="flex items-center justify-center h-10 relative">
              {/* 중앙 메뉴 아이콘 */}
              <div
                className={`
                absolute flex items-center justify-center w-10 h-10
                transition-opacity duration-300
                ${isHovered ? "opacity-0" : "opacity-100"}
              `}
              >
                <i className="ri-menu-line text-white text-xl"></i>
              </div>

              {/* 확장된 버튼들 */}
              <div
                className={`
                flex items-center justify-center space-x-6 w-full
                transition-opacity duration-300
                ${isHovered ? "opacity-100" : "opacity-0"}
              `}
              >
                {/* 홈 버튼 */}
                <NavButton
                  onClick={() => console.log("홈")}
                  isVisible={isHovered}
                  delay="100"
                >
                  홈
                </NavButton>

                {/* 마이페이지 버튼 */}
                <NavButton
                  onClick={() => console.log("마이페이지")}
                  isVisible={isHovered}
                  delay="200"
                >
                  마이페이지
                </NavButton>

                {/* 로그인/로그아웃 버튼 */}
                <NavButton
                  onClick={
                    isLoggedIn ? handleLogout : () => setIsLoginModalOpen(true)
                  }
                  isVisible={isHovered}
                  delay="300"
                >
                  {isLoggedIn ? "로그아웃" : "로그인"}
                </NavButton>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 회원가입 버튼 - 오른쪽 상단 */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={() => setIsSignupModalOpen(true)}
          className="backdrop-blur-md bg-white/20 border border-white/30 rounded-full shadow-lg px-6 py-3 text-white font-medium cursor-pointer whitespace-nowrap hover:bg-white/30 transition-all duration-300"
        >
          회원가입
        </button>
      </div>

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        onGoogleLogin={handleGoogleLogin}
      />

      {/* 회원가입 모달 */}
      <SignUpModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onSignup={handleSignup}
      />
    </>
  );
}

interface NavButtonProps {
  children: string;
  onClick: () => void;
  isVisible: boolean;
  delay: string;
}

function NavButton({ children, onClick, isVisible, delay }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 text-white font-medium cursor-pointer rounded-full
        transition-opacity duration-500 ease-out whitespace-nowrap
        hover:bg-white/20 hover:text-white
        ${isVisible ? "opacity-100" : "opacity-0"}
      `}
      style={{
        transitionDelay: isVisible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </button>
  );
}
