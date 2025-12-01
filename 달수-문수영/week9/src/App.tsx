import Header from './components/Header'
import CartList from './components/CartList'
import Summary from './components/Summary'
import ConfirmModal from './components/ConfirmModal'
import { useEffect } from 'react'
import { useCartStore } from './stores/cartStore'

function App() {
  const items = useCartStore(s => s.items)
  const calculateTotals = useCartStore(s => s.calculateTotals)

  // 수량/금액 변화 시 합계 갱신
  useEffect(() => {
    calculateTotals()
  }, [calculateTotals, items])

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <CartList />
        <Summary />
      </main>
      <ConfirmModal />
    </div>
  )
}

export default App
