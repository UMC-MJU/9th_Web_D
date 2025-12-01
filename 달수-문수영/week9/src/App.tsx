import Header from './components/Header'
import CartList from './components/CartList'
import Summary from './components/Summary'
import ConfirmModal from './components/ConfirmModal'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from './store'
import { calculateTotals } from './store/cartSlice'

function App() {
  const dispatch = useDispatch()
  const items = useSelector((state: RootState) => state.cart.items)

  // 수량/금액 변화 시 합계 갱신
  useEffect(() => {
    dispatch(calculateTotals())
  }, [dispatch, items])

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
