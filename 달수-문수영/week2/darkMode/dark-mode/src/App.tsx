
import "./App.css";
import { ThemeProvider } from "./context/ThemeProvider";
import ContextPage from "./ContextPage";

export default function App() {
  return (
    <ThemeProvider>
      <ContextPage />
    </ThemeProvider>
  );
}
