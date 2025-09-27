import { useContext } from 'react';
import { ThemeContext } from '../contexts/themeContext' // 경로에 맞게 수정해주세요.

export const useTheme = () => {
  // 1. useContext를 호출하여 context 값을 가져옵니다.
  const context = useContext(ThemeContext);

  // 2. context 값이 없는 경우(Provider로 감싸지지 않은 경우) 에러를 발생시킵니다.
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  // 3. context 값을 그대로 반환합니다.
  return context;
};