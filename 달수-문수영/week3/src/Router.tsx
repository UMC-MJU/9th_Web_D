/*핸들러와 매칭 테이블을 연결하는 Router.tsx*/
import React, { useEffect, useState } from "react"
import { onRouteChange } from "./lib/history"

//라우트 정의
type Route = { path: string; element: React.ReactNode } //라우트 하나는 path(주소)와 element(보여줄 컴포넌트)로 구성

const routes: Route[] = [
  { path: "/", element: <h1 className="text-2xl font-bold">Home</h1> },
  { path: "/about", element: <h1 className="text-2xl font-bold">About</h1> },
  { path: "/users", element: <h1 className="text-2xl font-bold">Users</h1> },
] //정적 테이블이라 /, /about, /users 세가지만 등록

//라우트 매칭 함수수
function match(path: string): React.ReactNode { //현재 URL 경로와 같은 path를 routes 배열에서 찾음
  const found = routes.find((r) => r.path === path)
  return found?.element ?? <h1 className="text-2xl font-bold">404 Not Found</h1>
} //찾으면 해당 element를 반환, 못 찾으면 404 페이지 출력

//Router 컴포넌트
export default function Router() {
  const [node, setNode] = useState<React.ReactNode>(null) //node라는 state를 만들어 현재 렌더링할 컴포넌트를 보관
  useEffect(() => onRouteChange((p) => setNode(match(p))), []) 
  //useEffect에서 onRouteChange를 등록해서 URL이 바뀔 때마다 match()로 매칭된 컴포넌트를 찾아 node 갱신
  return <>{node}</>
} //JSX에서 node를 출력하므로 주소가 변할 때마다 해당 화면이 갱신됨
