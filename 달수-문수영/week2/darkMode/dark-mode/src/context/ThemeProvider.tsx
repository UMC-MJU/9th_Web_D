import { createContext, useContext, useState, useEffect, type PropsWithChildren } from "react";

export const THEME = {
  LIGHT: "LIGHT",
  DARK: "DARK",
} as const;

type TTheme = (typeof THEME)[keyof typeof THEME];

interface IThemeContext {
  theme: TTheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<TTheme>(THEME.LIGHT);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === THEME.LIGHT ? THEME.DARK : THEME.LIGHT;
      console.log('테마 변경:', prev, '->', newTheme);
      return newTheme;
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    console.log('테마 적용 중:', theme);
    if (theme === THEME.DARK) {
      root.classList.add('dark');
      root.style.backgroundColor = '#000000';
      root.style.color = '#ffffff';
      console.log('다크 모드 적용됨');
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#ffffff';
      root.style.color = '#000000';
      console.log('라이트 모드 적용됨');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
