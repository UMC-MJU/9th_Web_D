import './App.css';
import CartList from './components/CartList';
import Navbar from './components/Navbar';
import PriceBox from './components/PriceBox';

function App() {
  return (
    <main>
      <Navbar />
      <CartList />
      <PriceBox />
    </main>
  );
}

export default App;