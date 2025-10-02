import { useState, useEffect } from "react";
import { getCurrentPath } from "../utils/utils";

// 현재 경로를 감지하고 변화를 추적하는 커스텀 훅
export const useCurrentPath = (): string => {
  const [currentPath, setCurrentPath] = useState<string>(getCurrentPath());

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getCurrentPath());
    };

    // popstate 이벤트 리스너 등록
    window.addEventListener("popstate", handlePopState);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return currentPath;
};
