import { useEffect, useState } from "react";

export const useRouter = () => {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPageChange = (event : PopStateEvent) => {
      setPath(event.state?.path || window.location.pathname);   // event.state가 null일경우 대비
    };
    window.addEventListener('popstate', onPageChange);          // popstat 이벤트 감지

    return () => {
      window.removeEventListener('popstate', onPageChange);     // 종료시 제거
    };
  }, [] );  // 처음 한번만 실행

   const push = (nextPath : string) => {
    if (path === nextPath) {
      return;                                                   // path가 같으면 리턴 (같은 페이지)
    }
    window.history.pushState({ path: nextPath }, '', nextPath); // pushState. 뒤로가기를 위한 기록 생성
    setPath(nextPath);                                          // path 값 변경
  };

  return { path, push };
}