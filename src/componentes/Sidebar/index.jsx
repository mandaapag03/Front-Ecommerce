import React from 'react';
import { Container, Content } from './styles';
import { 
  FaTimes, 
  FaHome,  
  FaRegSun, 
  FaUserAlt, 
  FaChartBar,
  FaShoppingCart,
  FaMoneyBill
} from 'react-icons/fa';
import SidebarItem from '../SidebarItem';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ active }) => {
  const navigate = useNavigate();

  const handlePainelDeControleProdutosClick = () => {
    navigate('/PainelDeControleProdutos');
  };

  const handlePainelDeControleUsuariosClick = () => {
    navigate('/PainelDeControle');
  };
  const handlePaginaInicialClick = () => {
    navigate('/');
  };

  const handlePainelDeControleAnalyticsClick  = () => {
    navigate('/AnalyticsPanel');
  };

  const handlePromotionsPanelClick  = () => {
    navigate('/PromotionsPanel');
  };


  const closeSidebar = () => {
    active(false);
  };

  return (
    <Container sidebar={active ? 'active' : 'inactive'}>
      <FaTimes onClick={closeSidebar} />  
      <Content>
        <SidebarItem Icon={FaHome} Text="Início" onClick={handlePaginaInicialClick} />
        <SidebarItem Icon={FaChartBar} Text="Estatísticas" onClick={handlePainelDeControleAnalyticsClick}/>
        <SidebarItem Icon={FaUserAlt} Text="Usuários" onClick={handlePainelDeControleUsuariosClick}/>
        <SidebarItem Icon={FaShoppingCart} Text="Produtos" onClick={handlePainelDeControleProdutosClick}/>
        <SidebarItem Icon={FaMoneyBill} Text="Promoções" onClick={handlePromotionsPanelClick}/>
        <SidebarItem Icon={FaRegSun} Text="Configurações" />
      </Content>
    </Container>
  );
}

export default Sidebar;
