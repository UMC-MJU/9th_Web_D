import useSidebar from './hooks/useSidebar';

function App() {
  const { isOpen: sidebarOpen, open, close } = useSidebar({
    lockBodyScroll: true,
    enableHotkeys: true,
  });

  return (
    <div className="min-h-dvh bg-gray-50 text-gray-900">
      <nav className="h-14 border-b bg-white/80 backdrop-blur sticky top-0 z-20 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="메뉴 열기"
            aria-expanded={sidebarOpen}
            onClick={open}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
            </svg>
          </button>
          <span className="font-semibold">달수의 사이드바</span>
        </div>
      </nav>

      <div
        aria-hidden={!sidebarOpen}
        className={`fixed inset-0 z-30 bg-black/30 transition-opacity ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={close}
      />
      <aside
        aria-label="사이드바"
        className={`fixed left-0 top-0 z-40 h-full w-64 bg-white shadow-lg border-r
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-14 border-b flex items-center justify-between px-3">
          <span className="text-sm font-semibold text-gray-700">메뉴</span>
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={close}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>
        <ul className="p-3 space-y-1 text-sm">
          <li><a className="block rounded px-2 py-2 hover:bg-gray-100 transition-colors" href="#">대시보드</a></li>
          <li><a className="block rounded px-2 py-2 hover:bg-gray-100 transition-colors" href="#">프로젝트</a></li>
          <li><a className="block rounded px-2 py-2 hover:bg-gray-100 transition-colors" href="#">알림</a></li>
          <li><a className="block rounded px-2 py-2 hover:bg-gray-100 transition-colors" href="#">설정</a></li>
        </ul>
      </aside>
      <main className="max-w-3xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">긴 본문 스크롤 테스트</h1>
        <section className="space-y-4">
          {Array.from({ length: 30 }).map((_, i) => (
            <p key={i} className="leading-7 text-gray-800">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer in sem a libero
              efficitur ultrices. Sed in augue lacinia, blandit nibh vitae, facilisis sapien.
              Phasellus venenatis, justo non dictum pharetra, risus odio aliquet nunc, at
              vestibulum velit libero sit amet urna. Suspendisse nec sollicitudin turpis. In
              viverra, dui vitae bibendum lacinia, risus arcu posuere turpis, at ultricies massa
              nulla sit amet orci. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
              posuere cubilia curae; Aliquam erat volutpat. Curabitur id tellus id tellus tincidunt
              interdum. Maecenas ultrices magna ac erat vehicula, at bibendum quam consequat. Donec
              vulputate, augue id vulputate porta, urna eros lobortis est, vel consectetur lectus
              risus et velit. Pellentesque habitant morbi tristique senectus et netus et malesuada
              fames ac turpis egestas.
            </p>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
