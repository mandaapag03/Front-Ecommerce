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
  setCart([...cart, product]);
  };


  useEffect(() => {
    fetch('http://localhost:5009/api/Produto')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Erro ao carregar os produtos:', error));
  }, []);

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
       <p>Preço: R${product.precoUnitario.toFixed(2)}</p>
       <button
       className={styles.buybutton}
       onClick={() => handleAddToCart(product)}>
       <FontAwesomeIcon icon={faShoppingCart} />
       Adicionar ao Carrinho
       </button>
          </div>
        ))}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal Carrinho"
        style={customModalStyles}
      >
        {}
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Itens do Seu Carrinho</h2>
        <button className={styles.closeButton} onClick={closeModal}>X</button>
        <div className="carrinho-container">
        <ul className={styles.cartItemList}>
        {cart.map((product) => (
        <li key={product.id} className={styles.cartItem}>
        <img src={product.foto} alt={product.nome} />
        <h3>{product.nome}</h3>
        <p>Preço: R${(product.precoUnitario).toFixed(2)}</p>
        <p>Quantidade: 1{product.quantidade}</p>
        <div>
        </div>
      </li>
    ))}
  </ul>
</div>
        <button className={styles.finishButton}>Finalizar Compra</button>
        {}
      </Modal>
    </div>
  );
};

export default ProductList;