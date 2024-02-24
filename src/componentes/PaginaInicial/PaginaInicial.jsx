import styles from './PaginaInicial.module.css';
import React, { useEffect, useState } from 'react';
import OhMyDog from '../Imgs/OhMyDog.jpg'
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import { faSignOutAlt, faUser, faHeart } from '@fortawesome/free-solid-svg-icons';


const customModalStyles = {
  content: {
    width: '60%',
    margin: 'auto',
    padding: '20px',
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
    borderRadius: '5px',
    backgroundColor: 'white',
  },
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [favoritos, setFavoritos] = useState([]);

  const [favoritosModalIsOpen, setFavoritosModalIsOpen] = useState(false);
  const isFavorito = (produto) => {
    return favoritos.some((fav) => fav.id === produto.id);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const navigateToPurchasing = () => {
    if (token) {
      navigate('/purchasing');
    } else {
      navigate('/login');
    }
  };

  const handleAddToFavoritos = async (produto) => {
    const updatedFavoritos = isFavorito(produto)
      ? favoritos.filter((fav) => fav.id !== produto.id)
      : [...favoritos, produto];
    setFavoritos(updatedFavoritos);

    try {
      const token = localStorage.getItem('token');
      const payload = getTokenPayload(token);
      const usuarioId = payload.nameid;

      const apiUrl = isFavorito(produto)
        ? 'http://localhost:5053/api/Favorites/item/delete'
        : 'http://localhost:5053/api/Favorites/item/add';

      const response = await fetch(apiUrl, {
        method: isFavorito(produto) ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId,
          produtoId: produto.id,
        }),
      });

      if (!response.ok) {
        console.error(`Erro ao ${isFavorito(produto) ? 'remover' : 'adicionar'} item aos favoritos na API:`, response.statusText);
      } else {
        console.log(`Item ${isFavorito(produto) ? 'removido dos' : 'adicionado aos'} favoritos com sucesso!`);
      }
    } catch (error) {
      console.error('Erro ao realizar chamada à API:', error);
    }
  };

  const handleRemoveFromFavoritos = async (produto) => {
    const updatedFavoritos = favoritos.filter((fav) => fav.id !== produto.id);
    setFavoritos(updatedFavoritos);
    try {
      const token = localStorage.getItem('token');
      const payload = getTokenPayload(token);
      const usuarioId = payload.nameid;

      const response = await fetch('http://localhost:5053/api/Favorites/item/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId,
          produtoId: produto.id,
        }),
      });
      if (!response.ok) {
        console.error('Erro ao remover item dos favoritos na API:', response.statusText);
      } else {
        console.log('Item removido dos favoritos com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao realizar chamada à API:', error);
    }
  };

  const openFavoritosModal = () => {
    setFavoritosModalIsOpen(true);
  };

  const closeFavoritosModal = () => {
    setFavoritosModalIsOpen(false);
  };


  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/Login');
  };

  const handleLogoff = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/');
  };

  const [cart, setCart] = useState([]);

  const handleAddToCart = async (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      const updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantidade: item.quantidade + 1, precoTotal: (item.quantidade + 1) * item.precoUnitario }
          : item
      );
      setCart(updatedCart);
    } else {
      const updatedProduct = { ...product, quantidade: 1, precoTotal: product.precoUnitario };
      setCart([...cart, updatedProduct]);
    }
    const token = localStorage.getItem('token');
    console.log('Token do localStorage:', token);
    if (token) {
      try {
        const payload = getTokenPayload(token);
        const usuarioId = payload.nameid;
        console.log('Usuario ID:', usuarioId);
        const response = await fetch('http://localhost:5053/api/Cart/item/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            usuarioId,
            produtoId: product.id,
          }),
        });

        if (!response.ok) {
          console.error('Erro ao adicionar item ao carrinho na API:', response.statusText);
        } else {
          console.log('Item adicionado ao carrinho com sucesso!');
        }
      } catch (error) {
        console.error('Erro ao extrair ID do usuário do token:', error);
      }
    }
  };

  const getTokenPayload = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
  };

  const handleIncreaseQuantity = (productId) => {
    const updatedCart = cart.map((product) =>
      product.id === productId
        ? { ...product, quantidade: product.quantidade + 1, precoTotal: (product.quantidade + 1) * product.precoUnitario }
        : product
    );
    setCart(updatedCart);
  };

  const handleDecreaseQuantity = async (productId) => {
    const existingProduct = cart.find((item) => item.id === productId);

    if (existingProduct) {
      const updatedCart = cart.map((product) =>
        product.id === productId
          ? {
            ...product,
            quantidade: existingProduct.quantidade > 1 ? existingProduct.quantidade - 1 : 0,
            precoTotal: existingProduct.quantidade > 1 ? (existingProduct.quantidade - 1) * existingProduct.precoUnitario : 0,
          }
          : product
      );

      const updatedCartWithoutZeroQuantities = updatedCart.filter((product) => product.quantidade > 0);
      setCart(updatedCartWithoutZeroQuantities);

      if (existingProduct.quantidade === 1) {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const payload = getTokenPayload(token);
            const usuarioId = payload.nameid;
            const apiUrl = `http://localhost:5053/api/Cart/item/delete`;
            console.log('Dados enviados para a API (DELETE):', apiUrl);
            const response = await fetch(apiUrl, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                usuarioId,
                produtoId: productId,
              }),
            });

            if (!response.ok) {
              console.error('Erro ao remover item do carrinho na API:', response.statusText);
            }
          } catch (error) {
            console.error('Erro ao extrair ID do usuário do token:', error);
          }
        }
      }
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5051/api/Product');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar os produtos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const updatedCart = cart.map((product) => ({
      ...product,
      total: product.quantidade * product.precoUnitario,
    }));
    setCart(updatedCart);
  }, [cart]);

  return (
    <div className={styles.petshopContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src={OhMyDog} alt="Logo OHMYDOG" />
        </div>
        <div className={styles.searchBar}>
          <input type="text" placeholder="Pesquisar produtos..." />
          <button className={styles.searchButton}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        {token ? (
          <div className={styles.loggedUserInfo}>
            <p onClick={toggleDropdown}>
              Bem-vindo, {JSON.parse(localStorage.getItem('userData')).nomeCompleto}!
            </p>
            {isDropdownVisible && (
              <div className={styles.dropdownContent}>
                <button>
                  <FontAwesomeIcon icon={faUser} />
                  <span>Perfil</span>
                </button>
                <button>
                  <FontAwesomeIcon icon={faHeart} />
                  <span onClick={openFavoritosModal}>Favoritos</span>
                </button>
                <button onClick={handleLogoff}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.loginButton}>
            <button onClick={handleLoginClick}>Login / Cadastro</button>
          </div>
        )}
        <div className={styles.cartButton} onClick={openModal}>
          <FontAwesomeIcon icon={faShoppingCart} />
          {cart.length > 0 && (
            <div className={styles.cartNotification}>{cart.length}</div>
          )}
        </div>
      </header>
      <div className={styles.productList}>
        {products.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <img src={product.foto} alt={product.nome} />
            <h2>{product.nome}</h2>
            <p>{product.descricao}</p>
            <p className={styles.priceLabel}>Preço: <span className={styles.priceValue}>R${product.precoUnitario.toFixed(2)}</span></p>
            <button
              className={styles.buybutton}
              onClick={() => handleAddToCart(product)}>
              <FontAwesomeIcon icon={faShoppingCart} />
              Adicionar ao Carrinho
            </button>
            <button
              className={`${styles.favoriteButton} ${favoritos.some((fav) => fav.id === product.id) ? styles.favoriteActive : ''}`}
              onClick={() => handleAddToFavoritos(product)}
            >
              <div className={styles.favoriteContent}>
                <FontAwesomeIcon icon={faHeart} className={styles.favoriteIcon} />
                <span className={styles.favoriteLabel}>
                  {favoritos.some((fav) => fav.id === product.id) ? 'Adicionado à Lista de Desejos' : 'Adicionar à Lista de Desejos'}
                </span>
              </div>
            </button>
          </div>
        ))}
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Modal Carrinho" style={customModalStyles}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Itens do Seu Carrinho</h2>
        <button className={styles.closeButton} onClick={closeModal}>
          X
        </button>
        <div className="carrinho-container">
          <ul className={styles.cartItemList}>
            {cart.map((product) => (
              <li key={product.id} className={styles.cartItem}>
                <img src={product.foto} alt={product.nome} />
                <h3>{product.nome}</h3>
                <p>Preço Unitário: R${product.precoUnitario.toFixed(2)}</p>
                <p>Preço Total: {product.precoTotal ? `R$${product.precoTotal.toFixed(2)}` : `R$${product.precoUnitario.toFixed(2)}`}</p>
                <p>Quantidade: {product.quantidade}</p>
                <div>
                  <button className={`minus ${styles.cartButton}`} onClick={() => handleDecreaseQuantity(product.id)}>-</button>
                  <button className={`plus ${styles.cartButton}`} onClick={() => handleIncreaseQuantity(product.id)}>+</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <button className={styles.finishButton} onClick={navigateToPurchasing}> Finalizar Compra </button>
      </Modal>
      <Modal isOpen={favoritosModalIsOpen} onRequestClose={closeFavoritosModal} contentLabel="Modal Favoritos" style={customModalStyles}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Lista De Desejos</h2>
        <button className={styles.closeButton} onClick={closeFavoritosModal}>
          X
        </button>
        <div className="favoritos-container">
          <ul className={styles.favoritosItemList}>
            {favoritos.map((product) => (
              <li key={product.id} className={styles.favoritosItem}>
                <img src={product.foto} alt={product.nome} />
                <h3>{product.nome}</h3>
                <button
                  className={styles.removeFavoriteButton}
                  onClick={() => handleRemoveFromFavoritos(product)}
                >
                  Remover dos Favoritos
                </button>
                <div>
                  <button className={styles.viewProductButton}>
                    Ver Produto
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  );
};

export default ProductList;
