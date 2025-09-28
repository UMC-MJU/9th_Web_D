import { useState, useEffect, type ReactNode } from "react";
import { ThemeContext } from "./ThemeContext";

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDark, setIsDark] = useState(() => {
    // localStorage에서 다크모드 설정을 가져오거나 기본값 false
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      const isDarkMode = saved ? JSON.parse(saved) : false;

      // 초기 로드시 HTML 클래스도 설정
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      return isDarkMode;
    }
    return false;
  });

  const toggleTheme = () => {
    setIsDark((prev: boolean) => !prev);
  };

  useEffect(() => {
    // 클라이언트에서만 실행
    if (typeof window !== "undefined") {
      // 다크모드 상태를 localStorage에 저장
      localStorage.setItem("darkMode", JSON.stringify(isDark));

      // HTML 요소에 다크모드 클래스 추가/제거
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
