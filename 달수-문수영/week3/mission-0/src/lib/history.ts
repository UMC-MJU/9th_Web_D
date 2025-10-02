type NavDetail = { path: string } //NavDetail 타입 정의

// pushState/replaceState 호출도 감지되도록 패치!, history API 패치
(function patch() {
  (["pushState", "replaceState"] as const).forEach((k) => {
    const orig = history[k]
    history[k] = function (...args: any[]) {
    /*const ret = orig.apply(this, args as any) TypeScript에서 noImplicitThis 규칙 때문에, 함수 안에서 this를 쓰면 그 타입을 명시해야함.
    this를 쓰지 않고, 컨텍스트를 명시적으로 history로 지정
    this쓰려면 
    history[k] = function (this: History, ...args: any[]) {
        const ret = orig.apply(this, args as any)
    }
    */
      const ret = orig.apply(history, args as any)
      const path = String(args[2] ?? location.pathname)
      window.dispatchEvent(new CustomEvent<NavDetail>("navchange", { detail: { path } }))
      return ret
    } as any
  })
})()

// 주소 변경!!!, 프로그래매틱 내비게이션
//코드에서 링크 클릭 없이도 경로를 바꾸는 헬퍼. 바뀌면 위의 패치 덕분에 pushState/replaceState가 호출되면면 navchange가 자동 발생함.
export function navigate(path: string, replace = false) {
  if (replace) history.replaceState({}, "", path)
  else history.pushState({}, "", path)
}

// 라우트 변경 구독!!!
export function onRouteChange(handler: (path: string) => void) {
  const onPop = () => handler(location.pathname)
  const onNav = (e: Event) => handler((e as CustomEvent<NavDetail>).detail.path)
  window.addEventListener("popstate", onPop) //뒤로/앞으로 가기 감지
  window.addEventListener("navchange", onNav)//pushState/replaceState 감지
  
  handler(location.pathname) // 초기 1회 즉시 호출(첫 렌더!)
  return () => {
    window.removeEventListener("popstate", onPop)
    window.removeEventListener("navchange", onNav)
  }
}
