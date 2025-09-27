import { useState, type ReactNode } from "react";
import type { themeType } from '../types/theme';
import { ThemeContext } from "../contexts/themeContext";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {   // 하위 html 태그 받아오기
  const [theme, setTheme] = useState<themeType>('🌙');                    // useState 사용

  const themeChange = (nowTheme: themeType) => {                            // theme 전환 코드
    if (nowTheme === '🌙') setTheme('☁️');
    else if (nowTheme === '☁️') setTheme('☀️');
    else if (nowTheme === '☀️') setTheme('🌙');
  };

  return (
    <ThemeContext.Provider value={{ theme, themeChange }}>
      {children}
    </ThemeContext.Provider>
  );
};
