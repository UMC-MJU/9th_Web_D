// 버튼에 대한 분리

import clsx from "clsx";
import { useTheme } from '../hooks/useTheme';

export const ThemeButton = () => {

  const { theme, themeChange } = useTheme();    // useContext 값 가져오기

  return(
  <button onClick={() => themeChange(theme)}
  className={clsx('p-4 text-4xl w-full flex justify-end', {
    'bg-black text-white': theme === '🌙',
    'bg-white text-black': theme === '☀️',
    'bg-[#808080] text-white': theme === '☁️',
  })}>
    {theme}
  </button>
); 

}