import styles from './PaginaInicial.module.css';
import axios from 'axios'
import InputMask from 'react-input-mask';
import React, { useEffect, useState } from 'react';
import OhMyDog from '../Imgs/OhMyDog.jpg'
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';

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

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/Login');
  };
    const [cart, setCart] = useState([]);
    const handleAddToCart = (product) => {
      const updatedCart = cart.map((item) => {
        if (item.id === product.id) {
          item.quantidade++;
          item.precoTotal = item.quantidade * item.precoUnitario;
          return item;
        }
        return item;
      });
      if (!updatedCart.some((item) => item.id === product.id)) {
        const updatedProduct = { ...product, quantidade: 1, precoTotal: product.precoUnitario };
        updatedCart.push(updatedProduct);
      }
      setCart(updatedCart);
    };

  const handleIncreaseQuantity = (productId) => {
    const updatedCart = cart.map((product) => {
      if (product.id === productId) {
        product.quantidade++;
        product.precoTotal = product.quantidade * product.precoUnitario;
      }
      return product;
    });
    setCart(updatedCart);
  };

  const handleDecreaseQuantity = (productId) => {
    const updatedCart = cart.map((product) => {
      if (product.id === productId) {
        if (product.quantidade > 1) {
          product.quantidade--;
          product.precoTotal = product.quantidade * product.precoUnitario;
        } else {
          return null;
        }
      }
      return product;
    });
    const filteredCart = updatedCart.filter((product) => product !== null);

    setCart(filteredCart);
  };

  useEffect(() => {
    fetch('http://localhost:5009/api/Produto')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Erro ao carregar os produtos:', error));
  }, []);
  useEffect(() => {
    const updatedCart = cart.map((product) => {
      product.total = product.quantidade * product.precoUnitario;
      return product;
    });
    setCart(updatedCart);
  }, [cart]);


  return (
    <div className={styles.petshopContainer}>
      <header className={styles.header}>
        <div className={styles.logo}> 
            <img src={OhMyDog} alt="Logo da sua loja" />
        </div>
        <div className={styles.searchBar}>
          <input type="text" placeholder="Pesquisar produtos..." />
          <button className={styles.searchButton}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        <div className={styles.loginButton}>
          <button onClick={handleLoginClick}>Login / Cadastro</button>
        </div>
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
    </div>
  );
};

export default ProductList;