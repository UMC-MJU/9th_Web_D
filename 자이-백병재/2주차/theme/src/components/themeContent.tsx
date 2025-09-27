// 내용에 대한 분리

import clsx from "clsx";
import { useTheme } from '../hooks/useTheme';

export const ThemeContent = () => {

  const { theme } = useTheme();    // useContext 값 가져오기

  return(
    <div className={clsx('px-4 h-dvh w-full', {
    'bg-black text-white': theme === '🌙',
    'bg-white text-black': theme === '☀️',
    'bg-[#808080] text-white': theme === '☁️',
  })}>
        <h1 className={clsx('text-4xl font-bold')}>
            Theme Mode
        </h1>
        <p className={clsx('text-xl mt-2')}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Tempora, obcaecati. Aspernatur eius provident animi quae similique corrupti, 
            repudiandae fugiat, a et adipisci voluptas quas iste deserunt iusto quo dolores obcaecati.
        </p>
  </div>
); 

}