import ContextPage from "./ContextPage";
import { ThemeProvider } from "./context/ThemeProvider";
import "./App.css";

export default function App() {
  return (
    <ThemeProvider>
      <ContextPage />
    </ThemeProvider>
  );
}
