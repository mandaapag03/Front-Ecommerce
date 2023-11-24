import styles from './PaginaInicial.module.css';
import React, { useEffect, useState } from 'react';
import OhMyDog from '../Imgs/OhMyDog.jpg'
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faShoppingCart} from '@fortawesome/free-solid-svg-icons';
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

  const handleToggleFavorite = (produto) => {
  const updatedFavoritos = isFavorito(produto)
    ? favoritos.filter((fav) => fav.id !== produto.id)
    : [...favoritos, produto];
    setFavoritos(updatedFavoritos);
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
  
  const handleAddToCart = (product) => {
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
  };
  
  const handleIncreaseQuantity = (productId) => {
  const updatedCart = cart.map((product) =>
      product.id === productId
        ? { ...product, quantidade: product.quantidade + 1, precoTotal: (product.quantidade + 1) * product.precoUnitario }
        : product
    );
    setCart(updatedCart);
  };

  const handleDecreaseQuantity = (productId) => {
  const updatedCart = cart.map((product) =>
      product.id === productId
        ? {
            ...product,
            quantidade: product.quantidade > 1 ? product.quantidade - 1 : 1,
            precoTotal: product.quantidade > 1 ? (product.quantidade - 1) * product.precoUnitario : product.precoUnitario,
          }
        : product
    );
    setCart(updatedCart);
  };

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5009/api/Produto');
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
            className={`${styles.favoriteButton} ${isFavorito(product) ? styles.favoriteActive : ''}`}
            onClick={() => handleToggleFavorite(product)}
            >
            <div className={styles.favoriteContent}>
            <FontAwesomeIcon icon={faHeart} className={styles.favoriteIcon} />
            <span className={styles.favoriteLabel}>
            {isFavorito(product) ? 'Adicionado à Lista de Desejos' : 'Adicionar à Lista de Desejos'}
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
        <button className={styles.finishButton}>Finalizar Compra</button>
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
                  onClick={() => handleToggleFavorite(product)}
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
