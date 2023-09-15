import './App.css';
import LoginCadastro from './componentes/LoginCadastro/LoginCadastro';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PainelDeControle from './componentes/AdminPanel/PainelDeControle';
import Header from './componentes/Header';
import PainelDeControleProdutos from './componentes/ProductsControl/PainelDeControleProdutos'

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LoginCadastro />} />
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
