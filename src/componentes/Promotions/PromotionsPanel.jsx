import React, { useState, useEffect } from 'react';
import '../Promotions/PromotionsPanel.css';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faBan } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import { faInfoCircle, faMoneyBill } from '@fortawesome/free-solid-svg-icons';

function PromotionsPanel() {
  const promotions_api = 'http://localhost:5069/api/Promotion/list';

  const [promotions, setPromotions] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    desconto: 0
  });

  const customModalStyles = {
    content: {
      width: '50%',
      height: '50%',
      margin: 'auto',
      padding: '20px',
      boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
      borderRadius: '5px',
      backgroundColor: 'white',
    },
  };
  

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5069/api/Promotion/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      if (response.ok) {
        fetchPromotions();
        closeModal();
      } else {
        console.error('Erro ao criar a promoção');
      }
    } catch (error) {
      console.error('Erro ao criar a promoção:', error);
    }
  };

  const fetchPromotions = async () => {
    try {
      const response = await fetch(promotions_api);
      if (response.ok) {
        const promotionsData = await response.json();
        setPromotions(promotionsData);
      } else {
        console.error('Erro ao buscar promoções da API');
      }
    } catch (error) {
      console.error('Erro ao buscar promoções da API:', error);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const columns = [
    {
      name: 'Nome',
      selector: 'nome'
    },
    {
      name: 'Descrição',
      selector: 'descricao'
    },
    {
      name: 'Desconto (%)',
      selector: 'desconto'
    },
    {
      name: 'Ações',
      cell: (row) => (
        <div>
          <button
            className="btn btn-danger action-button-delete"
            onClick={() => handleDelete(row.id)}
          >
            <FontAwesomeIcon icon={faBan} />
          </button>
        </div>
      )
    }
  ];

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5069/api/Promotion/delete/${id}`, {
        method: 'DELETE'
      });
  
      if (response.ok) {
        fetchPromotions();
      } else {
        console.error('Erro ao excluir a promoção');
      }
    } catch (error) {
      console.error('Erro ao excluir a promoção:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="table-title"><strong>Controle de Promoções</strong></h1>
      <div className="text-start">
        <button
          className="btn btn-success"
          id="botao-adicionar"
          onClick={openModal}
        >
          <FontAwesomeIcon icon={faEdit} style={{ marginRight: '5px' }} />
          Criar Promoção
        </button>
      </div><br />
      <div className="custom-table-container">
        <DataTable
          columns={columns}
          data={promotions}
        />
      </div>
      <Modal
  isOpen={modalIsOpen}
  onRequestClose={closeModal}
  contentLabel="Modal de Cadastro de Promoção"
  style={customModalStyles}
>
  <h2>Cadastro de Promoção</h2>
  <form>
    <div className="inputs">
      <div className="input">
        <FontAwesomeIcon icon={faInfoCircle} className="img" />
        <input
          type="text"
          name="nome"
          id="nome"
          placeholder="Nome Promoção"
          maxLength="60"
          value={formData.nome}
          onChange={handleInputChange}
        />
      </div>
      <div className="input">
        <FontAwesomeIcon icon={faInfoCircle} className="img" />
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
        <FontAwesomeIcon icon={faMoneyBill} className="img" />
        <input
          type="text"
          name="desconto"
          id="desconto"
          placeholder="Desconto (%)"
          value={formData.desconto}
          onChange={handleInputChange}
        />
      </div>
    </div>
  </form>
  <div className="modal-buttons">
    <button
      id="botao-salvar"
      className="btn btn-primary"
      onClick={handleSave}
    >
      Salvar
    </button>
    <button
      id="botao-cancelar" 
      className="btn btn-secondary" 
      onClick={closeModal}
    >
      Cancelar
    </button>
  </div>
</Modal>
    </div>
  );
}

export default PromotionsPanel;
