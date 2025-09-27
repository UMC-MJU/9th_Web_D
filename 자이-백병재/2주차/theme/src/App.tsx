import { createContext, useState } from 'react'
import './App.css'

type themeType = 'dark' | 'gray' | 'light';     // 테마 타입 지정

interface themeContextType {                    // context의 인터페이스 지정
  theme: themeType;
  themeChange: (nowTheme: themeType) => void;   // 타입을 변환할 함수
}

const themeContext = createContext<themeContextType | undefined>(undefined);

function App() {

  const [theme, setTheme] = useState<themeType>('dark');  // 기본값 설정

  const themeChange = (nowTheme: themeType) => {          // 테마의 변경 (useState 이용)
    if(nowTheme === 'dark') setTheme('gray');
    else if(nowTheme === 'gray') setTheme('light');
    else if(nowTheme === 'light') setTheme('dark');
  }

  return (
    <themeContext.Provider value ={{theme, themeChange}}>
      <div>
        <button onClick={() =>themeChange(theme)}>{theme} mode</button>
      </div>
    </themeContext.Provider>
  )
}

export default App
