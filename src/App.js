import './App.css';
import LoginCadastro from './componentes/LoginCadastro/LoginCadastro';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PainelDeControle from './componentes/AdminPanel/PainelDeControle';
import Header from './componentes/Header';
import PainelDeControleProdutos from './componentes/ProductsControl/PainelDeControleProdutos'
import PaginaInicial from './componentes/PaginaInicial/PaginaInicial';
import Purchasing from './componentes/Purchasing/Purchasing';
import AnalyticsPanel from './componentes/AnalyticsPanel/AnalyticsPanel';
import React, { useState, useEffect } from 'react';

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const saveCartToLocalStorage = (updatedCart) => {
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  useEffect(() => {
    loadCartFromLocalStorage();
  }, []);

  useEffect(() => {
    saveCartToLocalStorage(cart);
  }, [cart]);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
  };

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<PaginaInicial />} />
          <Route path="/Login" element={<LoginCadastro />} />
          <Route
            path="/Purchasing"
            element={<Purchasing updateCart={updateCart} cart={cart} />}
          />
          <Route
            path="/PainelDeControle"
            element={
              <>
                <Header />
                <PainelDeControle />
              </>
            }
          />
          <Route
            path="/PainelDeControleProdutos"
            element={
              <>
                <Header />
                <PainelDeControleProdutos />
              </>
            }
          />
          <Route
            path="/AnalyticsPanel"
            element={
              <>
                <Header  />
                <AnalyticsPanel/>
              </>
            }
            />
        </Routes>
      </Router>
    </div>
  );
}

export default App;