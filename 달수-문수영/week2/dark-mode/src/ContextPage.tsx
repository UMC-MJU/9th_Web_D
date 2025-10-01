import Navbar from "./Navbar";
import ThemeContent from "./ThemeContent";
import { useTheme } from "./context/ThemeProvider";

export default function ContextPage() {
  const { theme } = useTheme();
  const isDark = theme === "DARK";

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: isDark ? '#000000' : '#ffffff',
        color: isDark ? '#ffffff' : '#000000'
      }}
    >
      <Navbar />
      <main className="flex-1 w-full">
        <ThemeContent />
      </main>
    </div>
  );
}
