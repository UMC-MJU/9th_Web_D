import './index.css'
import MainPage from './components/MainPage'
import NewPage_1 from './components/NewPage_1'
import NewPage_2 from './components/NewPage_2'
import { useRouter } from './hooks/useRouter'
import type { url } from './types/url'


const urls: url = {
  "/": <MainPage />,
  "/1": <NewPage_1 />,
  "/2": <NewPage_2 />
}

function App() {
  const { path, push } = useRouter();

  return (
    <div>
      <nav className="flex justify-center items-center space-x-6 py-4">
        <button onClick={() => push('/')} className="px-4 py-2 text-xl hover:bg-gray-400 rounded-lg border-2 border-gray-300">
          MainPage</button>
        <button onClick={() => push('/1') } className="px-4 py-2 text-xl hover:bg-gray-400 rounded-lg border-2 border-gray-300">
          NewPage_1</button>
        <button onClick={() => push('/2')} className="px-4 py-2 text-xl hover:bg-gray-400 rounded-lg border-2 border-gray-300">
          NewPage_2</button>        
      </nav>
      <main>
        { urls[path] || <h1>Error!</h1>}
      </main>
    </ div>
  )
}

export default App
