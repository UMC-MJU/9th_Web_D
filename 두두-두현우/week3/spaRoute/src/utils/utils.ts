// 현재 URL의 경로를 가져오는 함수
export const getCurrentPath = (): string => {
  return window.location.pathname;
};

// pushState를 사용하여 URL을 변경하는 함수
export const navigateTo = (path: string): void => {
  window.history.pushState(null, "", path);
  // popstate 이벤트를 수동으로 트리거하여 상태 변화를 알림
  window.dispatchEvent(new PopStateEvent("popstate"));
};
