// 실제 화면상에 보일 버튼, h1 관리

import { ThemeButton } from "./themeButton";
import { ThemeContent } from "./themeContent";

const ThemeController = () => {

  return (
    <div className='flex flex-col items-center h-screen w-full transition-all'>
      <ThemeButton />
      <ThemeContent />
    </div>
  );
};

export default ThemeController;