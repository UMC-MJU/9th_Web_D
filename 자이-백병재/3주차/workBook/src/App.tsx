import './index.css'
import MainPage from './components/MainPage'
import NewPage_1 from './components/NewPage_1'
import NewPage_2 from './components/NewPage_2'
import { useRouter } from './hooks/useRouter'

const urls = {
  "/": <MainPage />,
  "/1": <NewPage_1 />,
  "/2": <NewPage_2 />
}

function App() {
  const { path, push } = useRouter();

  return (
    <div>
      <nav>
        <button onClick={() => push('/')}>MainPage</button>
        <button onClick={() => push('/1')}>NewPage_1</button>
        <button onClick={() => push('/2')}>NewPage_2</button>        
      </nav>
      <main>
        { urls[path] || <h1>Error!</h1>}
      </main>
    </ div>
  )
}

export default App
