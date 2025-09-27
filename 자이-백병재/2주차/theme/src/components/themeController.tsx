import React, { useContext } from 'react';
import { ThemeContext } from './themeContext';

const ThemeController = () => {
  const context = useContext(ThemeContext); // useContext로 가져오기

  if (context === undefined) {              // 값이 없으면 에러
    throw new Error('there is no context!');
  }

  const { theme, themeChange } = context;   // useContext 값 할당

  return (
    <div>
      <button onClick={() => themeChange(theme)}>{theme}</button>
      <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Tempora, obcaecati. Aspernatur eius provident animi quae similique corrupti, 
        repudiandae fugiat, a et adipisci voluptas quas iste deserunt iusto quo dolores obcaecati.</h1>
    </div>
  );
};

export default ThemeController;