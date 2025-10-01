import { THEME, useTheme } from "./context/ThemeProvider";

export default function ThemeContent() {
  const { theme } = useTheme();
  const isDark = theme === THEME.DARK;

  return (
    <div 
      className="p-6 rounded-lg shadow-lg mx-4 my-8 border"
      style={{
        backgroundColor: isDark ? '#111827' : '#ffffff',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        color: isDark ? '#ffffff' : '#000000'
      }}
    >
      <h1 className="text-2xl font-bold mb-4">ThemeContent</h1>
      <p className="mb-4">
        현재 테마는 {theme === THEME.LIGHT ? "라이트" : "다크"} 모드입니다.
      </p>
      <div className="space-y-2">
        <p 
          className="text-sm"
          style={{ color: isDark ? '#d1d5db' : '#374151' }}
        >
          • 다크 모드에서는 배경이 어두워집니다
        </p>
        <p 
          className="text-sm"
          style={{ color: isDark ? '#d1d5db' : '#374151' }}
        >
          • 텍스트 색상이 자동으로 조정됩니다
        </p>
        <p 
          className="text-sm"
          style={{ color: isDark ? '#d1d5db' : '#374151' }}
        >
          • 모든 컴포넌트가 일관된 테마를 적용합니다
        </p>
      </div>
    </div>
  );
}
