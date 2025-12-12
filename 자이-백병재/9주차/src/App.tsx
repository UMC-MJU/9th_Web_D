import { Provider } from 'react-redux';
import './App.css';
import CartList from './components/CartList';
import Navbar from './components/Navbar';
import store from './stores/store';
import PriceBox from './components/PriceBox';

function App() {
  return (
    <Provider store={store}>
      <Navbar />
      <CartList />
      <PriceBox />
    </Provider>
  );
}

export default App;