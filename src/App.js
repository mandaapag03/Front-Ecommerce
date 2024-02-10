import './App.css';
import LoginCadastro from './componentes/LoginCadastro/LoginCadastro';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PainelDeControle from './componentes/AdminPanel/PainelDeControle';
import Header from './componentes/Header';
import PainelDeControleProdutos from './componentes/ProductsControl/PainelDeControleProdutos'
import PaginaInicial from './componentes/PaginaInicial/PaginaInicial';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<PaginaInicial />} />
          <Route path="/Login" element={<LoginCadastro />} />
          <Route path="/PainelDeControle" element={
            <>
              <Header />
              <PainelDeControle />
            </>
          } />
          <Route path="/PainelDeControleProdutos" element={
            <>
              <Header />
              <PainelDeControleProdutos />
            </>
          } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
