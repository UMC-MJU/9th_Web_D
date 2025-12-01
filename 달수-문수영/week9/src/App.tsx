import Header from './components/Header'
import CartList from './components/CartList'
import Summary from './components/Summary'

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <CartList />
        <Summary />
      </main>
    </div>
  )
}

export default App
