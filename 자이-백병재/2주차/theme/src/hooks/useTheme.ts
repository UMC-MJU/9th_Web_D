// useContext를 수월히 하기 위한 훅

import { useContext } from 'react';
import { ThemeContext } from '../contexts/themeContext'

export const useTheme = () => {
  const context = useContext(ThemeContext); // usecontext로 값 가져오기

  if (context === undefined) {              // 값이 없으면 오류 발생
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};