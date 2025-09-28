import './App.css'
import { ThemeProvider } from './components/themeContext'
import ThemeController from './components/themeController'

function App() {
  return (
    <ThemeProvider>
      <ThemeController />
    </ThemeProvider>
  )
}

export default App