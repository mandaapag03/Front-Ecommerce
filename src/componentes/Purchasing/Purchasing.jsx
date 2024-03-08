import React, { useState, useEffect } from 'react';
import styles from './Purchasing.module.css';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import InputMask from 'react-input-mask';
import endereco_icon from '../Imgs/endereco_icon.png';
import axios from 'axios';
import { environment } from '../../environment/environment';

const Purchasing = ({ handleClose, token, cart, updateCart }) => {
  const navigate = useNavigate();
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [userSelections, setUserSelections] = useState({
  address: null,
  shippingMethod: null,
  paymentMethod: null,
  });
  

  const address_api = environment.user_api_url + '/api/Address';
  const payment_method_api = environment.payment_api_url + '/api/PaymentMethod';
  const shipping_api = environment.order_api_url + '/api/Shipping';
  const order_api = environment.order_api_url + '/api/Order';

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get(payment_method_api);
      setPaymentMethods(response.data);
    } catch (error) {
      console.error('Erro formas de pagamento, emynem esta triste:', error);
    }
  };
  useEffect(() => {
    if (progress === 4) {
      fetchPaymentMethods();
    }
  }, [progress]);
  

  const handleSelectPaymentMethod = (methodId) => {
    setSelectedPaymentMethod(methodId);
    setUserSelections({ ...userSelections, paymentMethod: formatPaymentMethod(paymentMethods.find(method => method.id === methodId)) });
  };

  const fetchShippingMethods = async () => {
    try {
      const response = await axios.get(shipping_api);
      setShippingMethods(response.data);
    } catch (error) {
      console.error('Erro de envio:', error);
    }
  };
  useEffect(() => {
    if (progress === 3) {
      fetchShippingMethods();
    }
  }, [progress]);

  const handleSelectShippingMethod = (methodId) => {
    setSelectedShippingMethod(methodId);
    setUserSelections({ ...userSelections, shippingMethod: formatShippingMethod(shippingMethods.find(method => method.id === methodId)) });
  };

  const [userId, setUserId] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
  const userIdFromToken = getTokenPayload(token).nameid;
  setUserId(userIdFromToken);
  console.log('UserID token:', userIdFromToken);
  }
  }, [token]);
  


  const formatAddress = (address) => {
    return `${address.logradouro}, ${address.numero}, ${address.bairro}, ${address.cidade}, ${address.uf}`;
  };

  const formatShippingMethod = (method) => {
    return `${method.descricao} - R$ ${method.valorFrete.toFixed(2)}`;
  };
  
  const formatPaymentMethod = (method) => {
    return method.descricao;
  };
  
  useEffect(() => {
    setUserSelections({
      ...userSelections,
      address: selectedAddress ? formatAddress(addresses.find(address => address.id === selectedAddress)) : null,
      shippingMethod: selectedShippingMethod ? formatShippingMethod(shippingMethods.find(method => method.id === selectedShippingMethod)) : null,
      paymentMethod: selectedPaymentMethod ? formatPaymentMethod(paymentMethods.find(method => method.id === selectedPaymentMethod)) : null,
      total: cart.reduce((total, product) => total + product.precoTotal, 0),
    });
  }, [cart, selectedAddress, addresses, selectedShippingMethod, shippingMethods, selectedPaymentMethod, paymentMethods]);

  const handleConfirmarPedido = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('Token não encontrado.');
    return;
  }

  const userId = parseInt(getTokenPayload(token).nameid, 10);
  const total = cart.reduce((acc, product) => acc + product.precoTotal, 0);
  const totalArredondado = parseFloat(total.toFixed(0));

  console.log('Informações do pedido antes de enviar:', {
    usuarioId: userId,
    formaPagamentoId: selectedPaymentMethod,
    formaEnvioId: selectedShippingMethod,
    enderecoId: selectedAddress,
    qtd_parecelas: 1,
    total: totalArredondado,
    itensPedido: cart.map((product) => ({
      produtoId: product.id,
      quantidade: product.quantidade,
    })),
  });

  const pedidoData = {
    usuarioId: userId,
    formaPagamentoId: selectedPaymentMethod,
    formaEnvioId: selectedShippingMethod,
    enderecoId: selectedAddress,
    qtd_parecelas: 1,
    total: parseFloat(userSelections.total.toFixed(2)),
    itensPedido: cart.map((product) => ({
      produtoId: product.id,
      quantidade: product.quantidade,
    })),
  };

  try {
  const response = await axios.post(order_api + '/create', pedidoData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  
    console.log('Resposta da API:', response.data);
    updateCart([]);
  } catch (error) {
    console.error('Erro ao confirmar o pedido:', error);
  } finally {
    navigate('/');
    alert('Pedido confirmado! Obrigado pela sua compra.');
  }
};

const fetchUserAddresses = async () => {
  try {
const token = localStorage.getItem('token');
  if (token) {
const userId = getTokenPayload(token).nameid;
const response = await axios.get(`${address_api}/list/${userId}`);
   setAddresses(response.data);
} else {
console.error('Token não encontrado.');
}
} catch (error) {
console.error('Erro ao buscar endereços do usuário:', error);
}
};


useEffect(() => {
  if (progress === 2) {
    fetchUserAddresses();
   }
 }, [progress]);

  const handleCheckpoint = (checkpointNumber) => {
    if (checkpointNumber <= 1) {
      alert('Não é possível fazer a identificação novamente, você já está logado.');
      return;
    }

    if (checkpointNumber > progress) {
      if (checkpointNumber === 3 && !selectedAddress) {
        alert('Selecione um endereço antes de avançar para o próximo passo.');
        return;
      }
      if (checkpointNumber === 4 && !selectedShippingMethod) {
        alert('Selecione um frete antes de avançar para o próximo passo.');
        return;
      }
      if (checkpointNumber === 5 && !selectedPaymentMethod) {
        alert('Termine de preencher todas as opções.');
        return;
      }
    }

    setProgress(checkpointNumber);
  const progressLine = document.getElementById('progressLine');
  if (progressLine) {
    progressLine.style.backgroundPosition = `${(checkpointNumber - 1) * 25}% 0%`;
  }
};

  useEffect(() => {
    setProgress(2);
  }, []);
  const handleSelectAddress = (address) => {
    setSelectedAddress(address.id);
    setUserSelections({ ...userSelections, address: formatAddress(address) });
  };
  const handleModalSaveAddress = async () => {
  const token = localStorage.getItem('token');
  const formData = {
    cep: document.getElementById('cep').value,
    logradouro: document.getElementById('logradouro').value,
    numero: parseInt(document.getElementById('numero').value),
    bairro: document.getElementById('bairro').value,
    cidade: document.getElementById('localidade').value,
    uf: document.getElementById('uf').value,
    complemento: document.getElementById('complemento').value,
  };

    try {
      if (token) {
        formData.idUsuario = getTokenPayload(token).nameid;
        console.log('ID do user:', formData.idUsuario);
        const response = await axios.post(address_api + `/register/${formData.idUsuario}`, formData);
        console.log('deu bom !', response.data);
        handleAddressModalClose();
        window.location.reload();
      } else {
        console.error('Token não encontrado. user sem chance chefe.');
      }
    } catch (error) {
      console.error('Erro ao enviar para a api:', error);
    }
  };

  const getTokenPayload = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(atob(base64));
  };

  const handleCadastrarEndereco = () => {
    setAddressModalOpen(true);
  };

  const handleVoltarParaInicio = () => {
    navigate('/');
  };

  const handleAddressModalClose = () => {
    setAddressModalOpen(false);
  };

  const handleSearchCEP = (e) => {
    e.preventDefault();

    const cep = document.getElementById('cep').value;
    axios
      .get(`https://viacep.com.br/ws/${cep}/json/`)
      .then((response) => {
        const cepData = response.data;
        console.log('Dados do CEP:', cepData);

        document.getElementById('logradouro').value = cepData.logradouro;
        document.getElementById('bairro').value = cepData.bairro;
        document.getElementById('localidade').value = cepData.localidade;
        document.getElementById('uf').value = cepData.uf;
      })
      .catch((error) => {
        console.error('Erro ao buscar o CEP:', error);
      });
  };

  return (
    <div className={styles.purchasingContainer}>
      <style>{`
      body {
        background-color: white;
        background-image: none;
      }
    `}</style>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Entrega</h2>
      <div className={styles.progressBar}>
        <div className={styles.progressIconContainer}>
          <div className={`${styles.progressCheckpoint} ${progress >= 1 ? styles.active : ''}`} onClick={() => handleCheckpoint(1)}>
            <span role="img" aria-label="Identificação">👤</span> Identificação
          </div>
          <div className={`${styles.progressCheckpoint} ${progress >= 2 ? styles.active : ''}`} onClick={() => handleCheckpoint(2)}>
            <span role="img" aria-label="Endereço">🏠</span> Endereço
          </div>
          <div className={`${styles.progressCheckpoint} ${progress >= 3 ? styles.active : ''}`} onClick={() => handleCheckpoint(3)}>
            <span role="img" aria-label="Frete">🚚</span> Frete
          </div>
          <div className={`${styles.progressCheckpoint} ${progress >= 4 ? styles.active : ''}`} onClick={() => handleCheckpoint(4)}>
            <span role="img" aria-label="Pagamento">💵</span> Pagamento
          </div>
          <div className={`${styles.progressCheckpoint} ${progress >= 5 ? styles.active : ''}`} onClick={() => handleCheckpoint(5)}>
            <span role="img" aria-label="Confirmação">✅</span> Confirmação
          </div>
        </div>

        <div className={styles.purchasingContainer}>
        </div>

        <div className={styles.progressLineContainer}>
          <div className={styles.progressLine} style={{ width: `${(progress - 1) * 25}%` }} />
        </div>
      </div>
      <div className={styles.addressListContainer}>
        {progress === 2 && addresses.length > 0 ? (
          <div>
            <h3>Seus Endereços:</h3>
            <ul>
              {addresses.map((address) => (
                <li
                  key={address.id}
                  className={`${styles.addressListItem} ${selectedAddress === address.id ? styles.selected : ''}`}
                  onClick={() => handleSelectAddress(address)}
                >
                  {address.logradouro}, {address.numero}, {address.bairro}, {address.cidade}, {address.uf}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>{progress === 2 ? 'Você ainda não cadastrou nenhum endereço.' : ''}</p>
        )}
      </div>

      {progress === 3 && shippingMethods.length > 0 && (
        <div className={styles.shippingMethodsContainer}>
          <h3>Escolha um frete disponível:</h3>
          <ul>
            {shippingMethods.map((method) => (
              <li
                key={method.descricao}
                className={`${styles.shippingMethod} ${selectedShippingMethod === method.id ? styles.selected : ''}`}
                onClick={() => handleSelectShippingMethod(method.id)}
              >
                <p>{method.descricao}</p>
                <p>R$ {method.valorFrete.toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {progress === 4 && paymentMethods.length > 0 ? (
        <div className={styles.paymentMethodListContainer}>
          <h3>Escolha a Forma de Pagamento:</h3>
          <ul>
            {paymentMethods.map((method) => (
              <li
                key={method.id}
                className={`${styles.paymentMethodItem} ${selectedPaymentMethod === method.id ? styles.selected : ''}`}
                onClick={() => handleSelectPaymentMethod(method.id)}
              >
                {method.descricao}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>{progress === 4 ? 'Nenhuma forma de pagamento disponível.' : ''}</p>
      )}
        {progress === 5 && (
          <div className={`${styles.checkpointContent}`}>
            <h3>Resumo do Pedido:</h3>
            <p><strong>Endereço:</strong> {userSelections.address ? userSelections.address : 'Selecione um endereço'}</p>
            <p><strong>Frete:</strong> {userSelections.shippingMethod ? userSelections.shippingMethod : 'Selecione um método de envio'}</p>
            <p><strong>Forma de Pagamento:</strong> {userSelections.paymentMethod ? userSelections.paymentMethod : 'Selecione uma forma de pagamento'}</p>

            <h4>Produtos no Carrinho:</h4>
            {cart.map((product) => (
              <div key={product.id}>
                <p><strong>{product.nome}:</strong> R${product.precoTotal.toFixed(2)}</p>
                <p>Quantidade: {product.quantidade}</p>
                <p>Preço Total: R${product.precoTotal.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
              <div className={styles.addressButtons}>
        {progress === 2 && (
          <button
            className={styles.cadastrarEnderecoButton}
            onClick={handleCadastrarEndereco}
          >
            Cadastrar Endereço
          </button>
        )}

        <button className={styles.voltarParaInicioButton} onClick={handleVoltarParaInicio}>
          Voltar para a Página Inicial
        </button>

        {progress === 2 && addresses.length > 0 && (
          <button
            className={`${styles.avancarFreteButton} ${selectedAddress ? '' : styles.disabled}`}
            onClick={() => handleCheckpoint(3)}
            disabled={!selectedAddress}
          >
            Avançar para o Frete
          </button>
        )}

        {progress === 3 && (
          <button
            className={`${styles.avancarPagamentoButton} ${selectedShippingMethod ? '' : styles.disabled}`}
            onClick={() => handleCheckpoint(4)}
            disabled={!selectedShippingMethod}
          >
            Avançar para o Pagamento
          </button>
        )}
        {progress === 4 && (
          <button
            className={`${styles.avancarPagamentoButton} ${styles.avancarConfirmacaoButton} ${selectedPaymentMethod ? '' : styles.disabled}`}
            onClick={() => handleCheckpoint(5)}
            disabled={!selectedPaymentMethod}
          >
            Avançar para a Confirmação
          </button>
        )}
        {progress === 5 && (
          <button
            className={`${styles.avancarPagamentoButton} ${styles.confirmarPedidoButton}`}
            onClick={handleConfirmarPedido}
          >
            Confirmar Pedido
          </button>
        )}
      </div>
      <Modal
        isOpen={isAddressModalOpen}
        onRequestClose={handleAddressModalClose}
        contentLabel="Modal de Cadastro"
        style={{
          content: {
            width: '60%',
            margin: 'auto',
            padding: '20px',
            boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
            borderRadius: '5px',
            backgroundColor: 'white',
          },
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Cadastro de Endereço</h2>
        <form>
          <div className="inputs">
            <div className="input">
              <img src={endereco_icon} alt="" />
              <InputMask
                type="text"
                name="cep"
                id="cep"
                mask="99999-999"
                placeholder="CEP"
              />
              <button id="buscar" onClick={handleSearchCEP}>
                Buscar
              </button>
            </div>

            <div className="input">
              <img src={endereco_icon} alt="" />
              <input type="text" name="logradouro" id="logradouro" placeholder="Logradouro" />
            </div>

            <div className="input">
              <img src={endereco_icon} alt="" />
              <input type="text" name="bairro" id="bairro" placeholder="Bairro" />
            </div>

            <div className="input">
              <img src={endereco_icon} alt="" />
              <input type="text" name="numero" id="numero" placeholder="Número" />
            </div>

            <div className="input">
              <img src={endereco_icon} alt="" />
              <input type="text" name="complemento" id="complemento" placeholder="Complemento" />
            </div>

            <div className="input">
              <img src={endereco_icon} alt="" />
              <input type="text" name="localidade" id="localidade" placeholder="Localidade" />
            </div>

            <div className="input">
              <img src={endereco_icon} alt="" />
              <input type="text" name="uf" id="uf" placeholder="UF" />
            </div>

          </div>
        </form>
        <div className="modal-buttons">
          <button id="botao-cancelar" onClick={handleAddressModalClose}> Cancelar </button>
          <button id="botao-salvar" onClick={handleModalSaveAddress}> Salvar </button>
        </div>
      </Modal>
    </div>
  );
};

export default Purchasing;