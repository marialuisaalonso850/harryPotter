import { Route, Routes } from 'react-router-dom';
import './index.css';
import { useState } from 'react';
import { Header } from './component/Header';
import Carrito from './component/carrito';
import Productos from './component/Productos';
import { AvailableQuantityProvider } from './AvailableQuantityContext';


function App() {
  const [allProducts, setAllProducts] = useState([]);
  const [total, setTotal] = useState(0);

  return (
    <AvailableQuantityProvider>
      <Header />
      <Routes>
        <Route
          path='/'
          element={<Productos allProducts={allProducts} setAllProducts={setAllProducts} total={total} setTotal={setTotal} />}
        />
        <Route
          path='/carrito'
          element={<Carrito allProducts={allProducts} setAllProducts={setAllProducts} total={total} setTotal={setTotal} />}
        />
      </Routes>
    </AvailableQuantityProvider>
  );
}

export default App;

