import React, { useState } from 'react';
import './PainelDeControleProdutos.css';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faBan } from '@fortawesome/free-solid-svg-icons';
import { faUser, faInfoCircle, faMoneyBill, faTags } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import CurrencyInput from 'react-currency-masked-input';    


function App() {
  const columns = [
    {
      name: "Id",
      selector: row => row.id,
      sortable: true
    },
    {
      name: "Produto",
      selector: row => row.produto
    },
    {
      name: "Preço",
      selector: row => row.preco
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
            onClick={() => handleInativar(row)}
          >
            <FontAwesomeIcon icon={faBan} />
          </button>

        </div>
      )
    }
  ];

  const data = [
    {
      id: 1,
      produto: 'Cleriston',
      preco: 'R$ 1,00',
    },
    {
      id: 2,
      produto: 'Emynem',
      preco: 'R$ 0,00',
    },
    {
      id: 3,
      produto: 'Gustagol',
      preco: 'Muito caro',
    },
  ];

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
  
  const [records, setRecords] = useState(data);

  function handleFilter(event) {
    const newData = data.filter(row => {
      return row.produto.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase())
    })
    setRecords(newData)
  }

  function handleEdit(row) {
    // Implementar a lógica de edição aqui
    console.log(`Editar produto: ${row.produto}`);
  }

  function handleInativar(row) {
    // Implementar a lógica de inativação aqui
    console.log(`Inativar produto: ${row.produto}`);
  }

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

  const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para controlar o modal

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className='container mt-5'>
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
            <div id='texto-filtrar'>
            <strong>Filtrar: </strong><input type="text" onChange={handleFilter}/>
            </div>
        </div>
      </div><br />
      <div className="custom-table-container"> {/* Container personalizado */}
        <DataTable 
          columns={columns}
          data={records}
          customStyles={customStyles}
          // pagination
        />
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal de Cadastro"
        style={customModalStyles}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Cadastro de Usuário</h2>
        <form>
        <div className="inputs">
            <div className="input">
                <FontAwesomeIcon icon={faUser} className='img'/>
                <input type="text" name="nome" id="nome" placeholder="Nome Produto" maxLength="60" />
            </div>
            <div className="input">
                <FontAwesomeIcon icon={faInfoCircle} className='img' />
                <input type="text" name="descricao" id="descricao" placeholder="Descrição" />
            </div>
            <div className="input">
                <FontAwesomeIcon icon={faMoneyBill} className='img' />
                <CurrencyInput
                    name="preco"
                    id="preco"
                    placeholder="Preço"
                    decimalSeparator=","
                    thousandSeparator="."
                    prefix="R$ "
                    autoFocus={false}
                />
            </div>
            <div className="input">
                <FontAwesomeIcon icon={faTags} className='img' />
                <input type="text" name="categoria" id="categoria" placeholder="Categoria" />
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
            // onClick={handleSave}
          >
            Salvar
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default App;
