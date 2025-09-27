import { createContext, useState, type ReactNode } from "react";
import type { themeType, themeContextType } from '../types/theme';

// 1. Context 생성
export const ThemeContext = createContext<themeContextType | undefined>(undefined);

// 2. provider 사용
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
