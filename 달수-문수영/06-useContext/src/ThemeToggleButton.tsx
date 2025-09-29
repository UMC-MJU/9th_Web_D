import { useTheme } from "./context/ThemeProvider";
import { THEME } from "./context/ThemeProvider";

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const isLightMode = theme === THEME.LIGHT;

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded-md transition-all duration-300 border font-medium"
      style={{
        backgroundColor: isLightMode ? '#ffffff' : '#000000',
        color: isLightMode ? '#000000' : '#ffffff',
        borderColor: isLightMode ? '#d1d5db' : '#4b5563'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isLightMode ? '#f9fafb' : '#1f2937';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isLightMode ? '#ffffff' : '#000000';
      }}
    >
      {isLightMode ? "🌙 다크 모드" : "☀️ 라이트 모드"}
    </button>
  );
}
