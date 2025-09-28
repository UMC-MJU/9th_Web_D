import { useState, useEffect, type ReactNode } from "react";
import { ThemeContext } from "./ThemeContext";

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDark, setIsDark] = useState(() => {
    // localStorage에서 다크모드 설정을 가져오거나 기본값 false
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const toggleTheme = () => {
    setIsDark((prev: boolean) => !prev);
  };

  useEffect(() => {
    // 다크모드 상태를 localStorage에 저장
    localStorage.setItem("darkMode", JSON.stringify(isDark));

    // HTML 요소에 다크모드 클래스 추가/제거
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
