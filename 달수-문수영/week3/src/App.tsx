import Link from "./components/Link" 
//link는 <a>태그 컴포넌트. 클릭하면 전체 리로드 대신 history.pushState를 호출해서 SPA방식으로 이동
import Router from "./Router"
//Router는 현재 URL 경로에 맞는 컴포넌트를 매칭해서 보여주는 컴포넌트

//APP 컴포넌트 본문
export default function App() {
  return (
    <div>
      {/* 상단 고정 네비게이션 바로 변경됨
          fixed top-0 left-0 w-full → 화면 맨 위에 고정
          bg-white border-b shadow p-4 → 배경/테두리/그림자/패딩 추가 */}
      <nav className="fixed top-0 left-0 w-full flex gap-4 bg-white border-b shadow p-4"> {/*상단 네비게이션 바. Flexbox로 배치, 링크 간격 4*/}
        <Link to="/" className="text-blue-600 underline">Home</Link> {/* 클릭 시 /경로로 이동, 전체 리로드 없음*/}
        <Link to="/about" className="text-blue-600 underline">About</Link> {/* /about경로로 이동*/}
        <Link to="/users" className="text-blue-600 underline">Users</Link> {/* /users경로로 이동*/}
        <Link to="/notfound" className="text-blue-600 underline">Not Found</Link> {/* /notfound경로로 이동*/}
      </nav>
      
      {/* pt-16 → 네비게이션 바 높이만큼 본문을 아래로 밀어줌 */}
      <main className="pt-20 p-6"> {/*전체 레이아웃, TailwindCSS로 padding 6, 위아래 요소 간격 6 적용*/}
        <Router /> {/*현재 URL 경로에 맞는 컴포넌트를 매칭해서 보여줌*/}
      </main>
    </div>
  )
}
