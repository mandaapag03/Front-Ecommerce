import styles from './PaginaInicial.module.css';
import React, { useEffect, useState } from 'react';
import OhMyDog from '../Imgs/OhMyDog.jpg'
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import { faSignOutAlt, faUser, faHeart, faClipboardList, faStar } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../environment/environment';


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

const ProductList = ({ usuarioId }) => {
  const [products, setProducts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [meusPedidosModalIsOpen, setMeusPedidosModalIsOpen] = useState(false);
  const [meusPedidosItens, setMeusPedidosItens] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [favoritos, setFavoritos] = useState([]);
  const [avaliacoesModalIsOpen, setAvaliacoesModalIsOpen] = useState(false);
  const [avaliacoes, setAvaliacoes] = useState([]);

  const order_api_favorites = environment.order_api_url + '/api/Favorites';
  const order_api_cart = environment.order_api_url + '/api/Cart';
  const product_api = environment.product_api_url + '/api/Product';

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
        ? order_api_favorites + '/item/delete'
        : order_api_favorites + '/item/add';

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

      const response = await fetch(order_api_favorites + '/item/delete', {
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

  const openMeusPedidosModal = () => {
    setMeusPedidosItens(cart);
    setMeusPedidosModalIsOpen(true);
  };

  const closeMeusPedidosModal = () => {
    setMeusPedidosModalIsOpen(false);
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
    fetchAvaliacoes(product.id);
  };
  
  const closeProductModal = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(false);
  };

  const handleCommentChange = (value) => {
    setComment(value);
  };

  const openAvaliacoesModal = async () => {
    setAvaliacoesModalIsOpen(true);
    if (selectedProduct) {
    try {
  const avaliacoes = await fetchAvaliacoes(selectedProduct.id);
    setAvaliacoes(avaliacoes);
  } catch (error) {
  console.error('não pingou filho, arruma isso ai:', error); 
}
 }
  };

  const closeAvaliacoesModal = () => {
    setAvaliacoesModalIsOpen(false);
  };

  const [userAvaliacoesModalIsOpen, setUserAvaliacoesModalIsOpen] = useState(false);


  const closeUserAvaliacoesModal = () => {
  setUserAvaliacoesModalIsOpen(false);
  };

  const enviarAvaliacao = async () => {
    try {
  const token = localStorage.getItem('token');
    if (token) {
  const payload = getTokenPayload(token);
  const usuarioId = payload.nameid;
  const produtoId = selectedProduct.id;
  const avaliacao = {
  usuarioId: usuarioId,
  produtoId: produtoId,
  nota: rating, 
  comentario: comment
  };

  const response = await fetch(environment.order_api_url + '/api/Rating/add', {
  method: 'POST',
  headers: {
  'Content-Type': 'application/json'
},
  body: JSON.stringify(avaliacao)
});
  
  if (response.ok) {
  setRating(0);
  setComment('');
  console.log('pingou na api, tudo certo!');
} else {
  console.error('não pingou filho, arruma isso ai:', response.statusText);
}
} else {
  console.error('Token não encontrado.');
}
} catch (error) {
  console.error('não pingou filho, arruma isso ai:', error);
}
};

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleAvaliacoes = async () => {
    try {
  const token = localStorage.getItem('token');
    if (token) {
  const payload = getTokenPayload(token);
  const usuarioId = payload.nameid;
  setUserAvaliacoesModalIsOpen(true);
  const apiUrl = `${environment.order_api_url}/api/Rating/list/user/${usuarioId}`;
  const response = await fetch(apiUrl);
    if (!response.ok) {
    throw new Error(`Erro ao buscar suas avaliações Dr.: ${response.statusText}`);
  }
  const avaliacoes = await response.json();
  setAvaliacoes(avaliacoes);
  } else {
  console.error('Token não encontrado.');
  }
  } catch (error) {
  console.error('Erro ao buscar suas avaliações Dr:', error);
 }
};

  const fetchAvaliacoes = async (productId) => {
    try {
  const response = await fetch(`${environment.order_api_url}/api/Rating/list/product/${productId}`);
      
    if (!response.ok) {
    throw new Error('Erro ao buscar suas avaliações Dr: ' + response.statusText);
}
      
  const data = await response.json();
   return data;
 } catch (error) {
   console.error('Erro ao buscar suas avaliações Dr:', error);
   return [];
 }
  };

   useEffect(() => {
   if (avaliacoesModalIsOpen && selectedProduct) {
   fetchAvaliacoes(selectedProduct.id);
}
}, [avaliacoesModalIsOpen, selectedProduct]);

  const renderStars = () => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
<span
    key={i}
    onClick={() => handleRatingChange(i)}
    className={i <= rating ? styles.starFilled : styles.star}
   >
    &#9733;
</span>
);
  }
    return stars;
};

  const handleDeleteAvaliacao = async (avaliacaoId) => {
  try {
  const response = await fetch(`${environment.order_api_url}/api/Rating/delete/${avaliacaoId}`, {
    method: 'DELETE',
    headers: {
    'Content-Type': 'application/json',
    },
  });

    if (!response.ok) {
    throw new Error('Não deu pra excluir, tem algo errado ai!');
    }

  const updatedAvaliacoes = avaliacoes.filter(avaliacao => avaliacao.id !== avaliacaoId);
  setAvaliacoes(updatedAvaliacoes);

  console.log('Avaliação excluída, perdeu jovem!');
  } catch (error) {
  console.error('Não deu pra excluir, tem algo errado ai! segue o erro jovem:', error);
  }
};

  const handleCancelOrder = (orderId) => {
  const updatedOrders = meusPedidosItens.filter((order) => order.id !== orderId);
    setMeusPedidosItens(updatedOrders);
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
        const response = await fetch(order_api_cart + '/item/add', {
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

      setCart(updatedCart);
      saveCartToLocalStorage(updatedCart);

      const updatedCartWithoutZeroQuantities = updatedCart.filter((product) => product.quantidade > 0);
      setCart(updatedCartWithoutZeroQuantities);

      if (existingProduct.quantidade === 1) {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const payload = getTokenPayload(token);
            const usuarioId = payload.nameid;
            const apiUrl = order_api_cart + `/item/delete`;
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
      const response = await fetch(product_api);
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
                  <span> Perfil</span>
                </button>
                <button>
                  <FontAwesomeIcon icon={faHeart} />
                  <span onClick={openFavoritosModal}> Favoritos</span>
                </button>
                <button onClick={handleAvaliacoes}>
                  <FontAwesomeIcon icon={faStar} />
                  <span>Minhas Avaliações</span>
                </button>
                <button>
                  <FontAwesomeIcon icon={faClipboardList} />
                  <span onClick={openMeusPedidosModal}> Meus Pedidos</span>
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
           <div key={product.id} className={styles.productCard} onClick={() => openProductModal(product)}>
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
      <Modal isOpen={meusPedidosModalIsOpen} onRequestClose={closeMeusPedidosModal} contentLabel="Modal Meus Pedidos" style={customModalStyles}>
  <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Meus Pedidos</h2>
  <button className={styles.closeButton} onClick={closeMeusPedidosModal}>
    X
  </button>
  <div className="meus-pedidos-container">
    <ul className={styles.cartItemList}>
      {meusPedidosItens.map((product) => (
        <li key={product.id} className={styles.cartItem}>
          <img src={product.foto} alt={product.nome} />
          <h3>{product.nome}</h3>
          <p>Preço Total: {`R$${product.precoTotal.toFixed(2)}`}</p>
          <p>Quantidade: {product.quantidade}</p>
          <div>
          <button
           className={styles.cancelPedidoButton}
           onClick={() => handleCancelOrder(product.id)}
          >
              Cancelar Pedido
          </button>
          <button className={styles.viewProductButton}>
              Ver Status do Pedido
          </button>
          <button className={styles.closeButton} onClick={closeMeusPedidosModal}>
          </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
</Modal>
<Modal isOpen={isProductModalOpen} onRequestClose={closeProductModal} contentLabel="Informações do Produto" style={customModalStyles}>
        {selectedProduct && (
        <div className={styles.productDetails}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Informações do Produto</h2>
        <img src={selectedProduct.foto} alt={selectedProduct.nome} className={styles.productImage} />
        <div className={styles.productInfo}>
        <h2>{selectedProduct.nome}</h2>
        <p>{selectedProduct.descricao}</p>
        <p className={styles.priceLabel}>Preço: <span className={styles.priceValue}>R${selectedProduct.precoUnitario.toFixed(2)}</span></p>
        <div className={styles.buttonsContainerOld}>
        <button onClick={() => handleAddToCart(selectedProduct)} className={`${styles.buybuttonnew}`}>
        <FontAwesomeIcon icon={faShoppingCart} />
        Adicionar ao Carrinho
        </button>
        <button
        className={`${styles.favoriteButton} ${isFavorito(selectedProduct) ? styles.favoriteActive : ''}`}
        onClick={() => handleAddToFavoritos(selectedProduct)}
        >
        <div className={styles.favoriteContent}>
        <FontAwesomeIcon icon={faHeart} className={styles.favoriteIcon} />
        <span className={styles.favoriteLabel}>
        {isFavorito(selectedProduct) ? 'Adicionado à Lista de Desejos' : 'Adicionar à Lista de Desejos'}
        </span>
        </div>
        </button>
        </div>
        <div className={styles.comment}>
        <h3>Deixe sua avaliação:</h3>
        <div className={styles.rating}>{renderStars()}</div>
        <textarea
        value={comment}
        onChange={(e) => handleCommentChange(e.target.value)}
        className={styles.commentInput}
        placeholder="Escreva o que achou do produto"
        />
        <div className={styles.buttonsContainer}>
        <button onClick={enviarAvaliacao} className={styles.addCommentButton}>
        Enviar Avaliação
        </button>
        <button onClick={openAvaliacoesModal} className={styles.verAvaliacoesButton}>
        Ver Avaliações
        </button>
        </div>
        </div>
        </div>
        </div>
      )}
        <button onClick={closeProductModal} className={styles.closeButton}>Fechar</button>
</Modal>
<Modal isOpen={avaliacoesModalIsOpen} onRequestClose={closeAvaliacoesModal} contentLabel="Avaliações do Produto" style={customModalStyles}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Avaliações do Produto</h2>
        <button onClick={closeAvaliacoesModal} className={styles.closeButton}>Fechar</button>
        <div className={styles.avaliacoesContainer}>
        {avaliacoes.map((avaliacao, index) => (
        <div key={index} className={styles.cartItem}>
        <h3>Avaliação de um Usuário Oh My Dog:</h3>
        <div className={styles.avaliacaoStars}>
        <h3>Nota:  {[...Array(avaliacao.nota)].map((_, index) => (
        <span key={index} className={styles.starFilled}>&#9733;</span>
        ))}</h3>
        </div>
        <h4>Comentário: {avaliacao.comentario}</h4>
        {avaliacao.usuarioId === usuarioId && (
        <button onClick={() => handleDeleteAvaliacao(avaliacao.id)} className={styles.deleteButton}>
        Excluir Avaliação
        </button>
        )}
        </div>
       ))}
    </div>
</Modal>
<Modal isOpen={userAvaliacoesModalIsOpen} onRequestClose={closeUserAvaliacoesModal} contentLabel="Minhas Avaliações" style={customModalStyles}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Minhas Avaliações</h2>
        <button onClick={() => setUserAvaliacoesModalIsOpen(false)} className={styles.closeButton}>Fechar</button>
        <div className={styles.avaliacoesContainer}>
        {avaliacoes.map((avaliacao, index) => (
        <div key={index} className={styles.cartItem}>
        <h3>Minha avaliação de um Produto Oh My Dog:</h3>
        <div className={styles.avaliacaoStars}>
        <h3>Nota: {[...Array(avaliacao.nota)].map((_, index) => (
        <span key={index} className={styles.starFilled}>&#9733;</span>
        ))}</h3>
        </div>
        <h4>Comentário: {avaliacao.comentario}</h4>
        <button onClick={() => handleDeleteAvaliacao(avaliacao.id)} className={styles.deleteButton}>
        Excluir Avaliação
        </button>
        </div>
        ))}
      </div>
</Modal>
</div>
  );
};

export default ProductList;
