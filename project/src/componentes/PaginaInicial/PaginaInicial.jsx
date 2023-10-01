import styles from './PaginaInicial.module.css';
import axios from 'axios'
import InputMask from 'react-input-mask';
import React, { useEffect, useState } from 'react';
import OhMyDog from '../Imgs/OhMyDog.png'
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/Login');
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
      </header>
      <div className={styles.productList}>
        {products.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <img src={product.foto} alt={product.nome} />
            <h2>{product.nome}</h2>
            <p>{product.descricao}</p>
            <p>Preço: R${product.precoUnitario.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;