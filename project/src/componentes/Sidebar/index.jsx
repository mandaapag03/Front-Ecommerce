import React from 'react';
import { Container, Content } from './styles';
import { 
  FaTimes, 
  FaHome,  
  FaRegSun, 
  FaUserAlt, 
  FaChartBar,
  FaShoppingCart
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

  const closeSidebar = () => {
    active(false);
  };

  return (
    <Container sidebar={active ? 'active' : 'inactive'}>
      <FaTimes onClick={closeSidebar} />  
      <Content>
        <SidebarItem Icon={FaHome} Text="Início" />
        <SidebarItem Icon={FaChartBar} Text="Estatísticas" />
        <SidebarItem Icon={FaUserAlt} Text="Usuários" onClick={handlePainelDeControleUsuariosClick}/>
        <SidebarItem Icon={FaShoppingCart} Text="Produtos" onClick={handlePainelDeControleProdutosClick}/>
        <SidebarItem Icon={FaRegSun} Text="Configurações" />
      </Content>
    </Container>
  );
}

export default Sidebar;
