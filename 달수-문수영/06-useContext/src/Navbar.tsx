import ThemeToggleButton from "./ThemeToggleButton";
import { useTheme } from "./context/ThemeProvider";

export default function Navbar() {
  const { theme } = useTheme();
  const isDark = theme === "DARK";

  return (
    <nav 
      className="flex justify-between items-center p-4 border-b w-full"
      style={{
        backgroundColor: isDark ? '#1a1a1a' : '#f3f4f6',
        borderColor: isDark ? '#374151' : '#d1d5db',
        color: isDark ? '#ffffff' : '#000000'
      }}
    >
      <h1 className="text-lg font-semibold">Navbar</h1>
      <ThemeToggleButton />
    </nav>
  );
}
