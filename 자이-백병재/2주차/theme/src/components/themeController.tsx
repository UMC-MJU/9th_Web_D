// 실제 화면상에 보일 버튼, h1 관리

import { useTheme } from '../hooks/useTheme';

const ThemeController = () => {
  const { theme, themeChange } = useTheme();    // useContext 값 가져오기

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <button onClick={() => themeChange(theme)}>{theme}</button>   {/* 함수 연결 */}
      <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Tempora, obcaecati. Aspernatur eius provident animi quae similique corrupti, 
        repudiandae fugiat, a et adipisci voluptas quas iste deserunt iusto quo dolores obcaecati.</h1>
    </div>
  );
};

export default ThemeController;