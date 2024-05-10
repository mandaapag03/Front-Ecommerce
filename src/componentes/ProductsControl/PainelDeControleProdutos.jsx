import React, { useState, useEffect } from 'react';
import './PainelDeControleProdutos.css';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faBan } from '@fortawesome/free-solid-svg-icons';
import { faUser, faInfoCircle, faMoneyBill, faTags, faImage } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import CurrencyInput from 'react-currency-masked-input';
import { environment } from '../../environment/environment';

function App() {

  //#region Dados Grid
  const product_api = environment.product_api_url + '/api/Product';
  const product_api_category = environment.product_api_url + '/api/Category';

  const [products, setProducts] = useState([]);
  const [promotionsList, setPromotionsList] = useState([]);
  const [promotionsModalIsOpen, setPromotionsModalIsOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null); 

  const columns = [
    {
      name: 'Status',
      cell: (row) => (
        <span>{row.isActive ? 'Ativo' : 'Inativo'}</span>
      ),
    },
    {
      name: "Produto",
      selector: row => row.nome
    },
    {
      name: "Descrição",
      selector: row => row.descricao
    },
    {
      name: "Preço",
      selector: (row) => {
        const preco = parseFloat(row.precoUnitario);
        return `R$ ${preco.toFixed(2).replace('.', ',')}`;
      },
    },
    {
      name: "Ações",
      cell: (row) => (
        <div>
          <button
            className="btn btn-primary mr-2 action-button-edit"
            onClick={() => handleEdit(row)}
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            className="btn btn-danger action-button-ban"
            style={{ marginLeft: '5px' }}
            onClick={() => openConfirmationModal(row.id)}
          >
            <FontAwesomeIcon icon={faBan} />
          </button>
          <button
            id="botao-aplicar"
            style={{ marginLeft: '5px' }}
            onClick={() => openPromotionsModal(row.id)}
          >
            Aplicar Promoção
          </button>
        </div>
      )
    }
  ];

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(product_api);
        if (response.ok) {
          const productsData = await response.json();
          console.log(productsData)
          console.log('productsData')
          setProducts(productsData);
        } else {
          console.error('Erro ao buscar produtos da API');
        }
      } catch (error) {
        console.error('Erro ao buscar produtos da API:', error);
      }
    }

    fetchProducts();
  }, []);

  const customStyles = {
    rows: {
      style: {
        fontSize: '16px',
      },
    },
    headRow: {
      style: {
        fontSize: '18px',
      },
    },
    headCells: {
      style: {
        fontSize: '18px',
      },
    },
    table: {
      style: {
        width: '100%',
      },
    },
  };

  //#endregion

  const [isLoading, setIsLoading] = useState(false);

  //#region Modal Styles

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

  const customModalStylesInativar = {
    content: {
      width: '60%',
      height: '120px',
      margin: 'auto',
      padding: '20px',
      boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
      borderRadius: '5px',
      backgroundColor: 'white',
    },
  };

  //#endregion

  //#region Dados Dropdown Categoria

  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const response = await fetch(product_api_category);
        if (response.ok) {
          const categoriasData = await response.json();
          setCategorias(categoriasData);
        } else {
          console.error('Erro ao buscar categorias da API');
        }
      } catch (error) {
        console.error('Erro ao buscar categorias da API:', error);
      }
    }

    fetchCategorias();
  }, []);

  //#endregion

  //#region Cadastro de Produtos

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    foto: '',
    precoUnitario: null,
    isActive: true,
    categoriaId: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoriaChange = (e) => {
    setCategoriaSelecionada(e.target.value);
    setFormData({
      ...formData,
      categoriaId: e.target.value,
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      setTimeout(async () => {
        const response = await fetch(product_api + '/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          closeModal();
          window.location.reload();
        } else {
          console.error('Erro ao cadastrar o produto');
        }
        setIsLoading(false);

      }, 1000);

    } catch (error) {
      console.error('Erro ao cadastrar o produto:', error);
    }
  };

  //#endregion

  //#region Edição de Produto

  const [editingProduct, setEditingProduct] = useState(null);

  function handleEdit(row) {
    setEditingProduct(row);
    openModalEdit();
  }

  const [modalIsOpenEdit, setModalIsOpenEdit] = useState(false);

  const openModalEdit = () => {
    setModalIsOpenEdit(true);
  };

  const closeModalEdit = () => {
    setModalIsOpenEdit(false);
  };

  const handleInputChangeEdit = (e) => {
    const { name, value } = e.target;
    setEditingProduct({
      ...editingProduct,
      [name]: value,
    });
  };

  const handleSaveEdit = async () => {
    setIsLoading(true);
    try {
      setTimeout(async () => {
        const response = await fetch(product_api + `/change/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingProduct),
        });

        if (response.ok) {
          closeModalEdit();
          window.location.reload();
        } else {
          console.error('Erro ao editar o produto');
        }
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao editar o produto:', error);
    }
  };

  //#endregion

  //#region Inativar Produto

  const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
  const [productIdToInactivate, setProductIdToInactivate] = useState(null);

  const openConfirmationModal = (productId) => {
    setProductIdToInactivate(productId);
    setConfirmationModalIsOpen(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModalIsOpen(false);
  };

  const applyPromotion = async (productId, promotionId) => {
    try {
      const response = await fetch('http://localhost:5069/api/CurrentPromotion/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          produtoId: productId,
          promocaoId: promotionId,
        }),
      });
      if (response.ok) {
        console.log('Promoção aplicada com sucesso');
      } else {
        console.error('Erro ao aplicar a promoção');
      }
    } catch (error) {
      console.error('Erro ao aplicar a promoção:', error);
    }
  };

  const deletePromotion = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5069/api/CurrentPromotion/delete/${productId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Promoção removida com sucesso');
      } else {
        console.error('Erro ao remover a promoção');
      }
    } catch (error) {
      console.error('Erro ao remover a promoção:', error);
    }
  };

  const openPromotionsModal = async () => {
    try {
      const response = await fetch('http://localhost:5069/api/Promotion/list');
      if (response.ok) {
        const promotionsData = await response.json();
        setPromotionsList(promotionsData);
        setPromotionsModalIsOpen(true);
      } else {
        console.error('Erro ao buscar promoções da API');
      }
    } catch (error) {
      console.error('Erro ao buscar promoções da API:', error);
    }
  };

  const closePromotionsModal = () => {
    setPromotionsModalIsOpen(false);
  };

  const handleConfirmInactivate = async () => {
    setIsLoading(true);
    try {
      setTimeout(async () => {
        const response = await fetch(product_api + `/inactivate/${productIdToInactivate}`, {
          method: 'PUT',
        });

        if (response.ok) {
          setConfirmationModalIsOpen(false);
          window.location.reload();
        } else {
          console.error('Erro ao inativar o produto');
        }
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao inativar o produto:', error);
    }
  };

  const fetchPromotionsList = async () => {
    try {
      const response = await fetch(`${environment.promotions_api_url}/api/Promotion/list`);
      if (response.ok) {
        const promotionsData = await response.json();
        setPromotionsList(promotionsData);
      } else {
        console.error('Erro ao buscar promoções da API');
      }
    } catch (error) {
      console.error('Erro ao buscar promoções da API:', error);
    }
  };

  useEffect(() => {
    fetchPromotionsList();
  }, []);

  //#endregion

  return (
    <div className='container mt-5'>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <h1 className='table-title'><strong>Controle de Produtos</strong></h1>
      <div className='text-start'>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            className="btn btn-success"
            id='botao-adicionar'
            onClick={openModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '10%',
              marginLeft: '5px',
              backgroundColor: 'rgb(12, 214, 12)',
              color: 'white',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              border: '10px'
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgb(25, 122, 25)')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgb(12, 214, 12)')}
          >
            <FontAwesomeIcon icon={faUser} style={{ marginRight: '5px' }} />
            Criar
          </button>
          {/* <div id='texto-filtrar'>
              <strong>Filtrar: </strong><input type="text" onChange={handleFilter}/>
            </div> */}
        </div>
      </div><br />
      <div className="custom-table-container">
        <DataTable
          columns={columns}
          data={products}
          customStyles={customStyles}
        />
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal de Cadastro"
        style={customModalStyles}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Cadastro de Produto</h2>
        <form>
          <div className="inputs">
            <div className="input">
              <FontAwesomeIcon icon={faUser} className='img' />
              {/* <input type="text" name="nome" id="nome" placeholder="Nome Produto" maxLength="60" /> */}
              <input
                type="text"
                name="nome"
                id="nome"
                placeholder="Nome Produto"
                maxLength="60"
                value={formData.nome}
                onChange={handleInputChange} />
            </div>
            <div className="input">
              <FontAwesomeIcon icon={faInfoCircle} className='img' />
              {/* <input type="text" name="descricao" id="descricao" placeholder="Descrição" /> */}
              <input
                type="text"
                name="descricao"
                id="descricao"
                placeholder="Descrição"
                value={formData.descricao}
                onChange={handleInputChange}
              />
            </div>
            <div className="input">
              <FontAwesomeIcon icon={faMoneyBill} className='img' />
              <CurrencyInput
                name="precoUnitario"
                id="precoUnitario"
                placeholder="Preço"
                decimalSeparator=","
                thousandSeparator="."
                prefix="R$ "
                autoFocus={false}
                value={formData.precoUnitario}
                onChange={handleInputChange}
              />
            </div>
            <div className="input">
              <FontAwesomeIcon icon={faTags} className='img' />
              {/* <input type="text" name="categoria" id="categoria" placeholder="Categoria" /> */}
              <select
                name="categoriaId"
                id="categoriaId"
                value={categoriaSelecionada}
                onChange={handleCategoriaChange}
              >
                <option value="">Clique para selecionar uma categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="input">
              <FontAwesomeIcon icon={faImage} className='img' />
              <input
                type="text"
                name="foto"
                id="foto"
                placeholder="URL da Foto"
                value={formData.foto}
                onChange={handleInputChange}
              />
            </div>
          </div>

        </form>

        <div className="modal-buttons">
          <button
            id="botao-cancelar"
            onClick={closeModal}
          >
            Cancelar
          </button>
          <button
            id="botao-salvar"
            onClick={handleSave}
          >
            Salvar
          </button>
        </div>
      </Modal>


      <Modal
        isOpen={modalIsOpenEdit}
        onRequestClose={closeModalEdit}
        contentLabel="Modal de Edição"
        style={customModalStyles}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Editar Produto</h2>
        <form>
          <div className="inputs">
            <div className="input">
              <FontAwesomeIcon icon={faUser} className='img' />
              <input
                type="text"
                name="nome"
                id="nome"
                placeholder="Nome Produto"
                maxLength="60"
                value={editingProduct?.nome || ''}
                onChange={handleInputChangeEdit}
              />
            </div>
            <div className="input">
              <FontAwesomeIcon icon={faInfoCircle} className='img' />
              <input
                type="text"
                name="descricao"
                id="descricao"
                placeholder="Descrição"
                value={editingProduct?.descricao || ''}
                onChange={handleInputChangeEdit}
              />
            </div>
            <div className="input">
              <FontAwesomeIcon icon={faMoneyBill} className='img' />
              <CurrencyInput
                name="precoUnitario"
                id="precoUnitario"
                placeholder="Preço"
                decimalSeparator=","
                thousandSeparator="."
                prefix="R$ "
                autoFocus={false}
                value={editingProduct?.precoUnitario || ''}
                onChange={handleInputChangeEdit}
              />
            </div>
            <div className="input">
              <FontAwesomeIcon icon={faTags} className='img' />
              <select
                name="categoriaId"
                id="categoriaId"
                value={editingProduct?.categoriaId || ''}
                onChange={handleInputChangeEdit}
              >
                <option value="">Clique para selecionar uma categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="input">
              <FontAwesomeIcon icon={faImage} className='img' />
              <input
                type="text"
                name="foto"
                id="foto"
                placeholder="URL da Foto"
                value={editingProduct?.foto || ''}
                onChange={handleInputChangeEdit}
              />
            </div>
          </div>
        </form>

        <div className="modal-buttons">
          <button
            id="botao-cancelar"
            onClick={closeModalEdit}
          >
            Cancelar
          </button>
          <button
            id="botao-salvar"
            onClick={handleSaveEdit}
          >
            Salvar
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={confirmationModalIsOpen}
        onRequestClose={closeConfirmationModal}
        contentLabel="Modal de Confirmação"
        style={customModalStylesInativar}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Tem certeza que deseja inativar este produto?</h2>

        <div className="modal-buttons">
          <button
            id="botao-cancelar"
            onClick={closeConfirmationModal}
          >
            Cancelar
          </button>
          <button
            id="botao-inativar"
            onClick={handleConfirmInactivate}
          >
            Inativar
          </button>
        </div>
      </Modal>

      <Modal
  isOpen={promotionsModalIsOpen}
  onRequestClose={closePromotionsModal}
  contentLabel="Modal de Promoções"
  style={customModalStyles}
>
  <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Promoções Disponíveis</h2>

  <div className="promotions-container">
    {promotionsList.map((promotion) => (
      <div key={promotion.id} className="promotion-item">
        <input type="checkbox" id={`promotion_${promotion.id}`} name={`promotion_${promotion.id}`} value={promotion.id} />
        <label htmlFor={`promotion_${promotion.id}`}>{promotion.nome} - {promotion.desconto}%</label>
      </div>
    ))}
  </div>

  <div className="modal-buttons">
    <button
      id="botao-cancelar"
      onClick={closePromotionsModal}
    >
      Cancelar
    </button>
   <button
  id="botao-salvar"
  onClick={applyPromotion}
>
  Aplicar
</button>
    <button
      id="botao-cancelar"
      onClick={() => {
        deletePromotion(selectedProductId);
        closePromotionsModal();
      }}
    >
      Deletar Promoção
    </button>
  </div>
</Modal>

    </div>
  );
}

export default App;
