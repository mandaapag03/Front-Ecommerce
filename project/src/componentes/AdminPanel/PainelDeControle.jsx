import React, { useState } from 'react';
import './PainelDeControle.css';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faBan } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import user_icon from '../Imgs/user.png';
import email_icon from '../Imgs/email.png';
import senha_icon from '../Imgs/senha.png';
import cpf_icon from '../Imgs/cpf_icon.png';
import InputMask from 'react-input-mask';
import endereco_icon from '../Imgs/endereco_icon.png'
import telefone_icon from '../Imgs/telefone_icon.png'

function App() {
  const columns = [
    {
      name: "Nome",
      selector: row => row.name,
      sortable: true
    },
    {
      name: "Email",
      selector: row => row.email
    },
    {
      name: "Telefone",
      selector: row => row.telefone
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
      name: 'Cleriston',
      email: 'cleriston.black@gmail.com',
      telefone: '(11) 99999-9999'
    },
    {
      id: 2,
      name: 'Emynem',
      email: 'emynem@gmail.com',
      telefone: '(11) 99999-9999'
    },
    {
      id: 3,
      name: 'Gustagol',
      email: 'gustavo.gol@gmail.com',
      telefone: '(11) 99999-9999'
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
      return row.name.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase())
    })
    setRecords(newData)
  }

  function handleEdit(row) {
    // Implementar a lógica de edição aqui
    console.log(`Editar usuário: ${row.name}`);
  }

  function handleInativar(row) {
    // Implementar a lógica de inativação aqui
    console.log(`Inativar usuário: ${row.name}`);
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

  const [modalIsOpen, setModalIsOpen] = useState(false); 

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className='container mt-5'>
      <h1 className='table-title'><strong>Controle de Usuários</strong></h1>
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
      <div className="custom-table-container">
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
              <img src={user_icon} alt="" />
              <input type="text" name="nome" id="nome" placeholder="Nome completo" maxLength="60" />
            </div>
            <div className="input">
              <img src={email_icon} alt="" />
              <input type="email" name="email" id="email" placeholder="Email" />
            </div>
            <div className="input">
              <img src={senha_icon} alt="" />
              <input type="password" name="senha" id="senha" placeholder="Senha" />
            </div>
            <div className="input">
              <img src={cpf_icon} alt="" />
              <InputMask
                type="text"
                name="cpf"
                id="cpf"
                mask="999.999.999-99"
                placeholder="CPF"
              />
            </div>
            <div className="input">
              <img src={telefone_icon} alt="" />
              <InputMask
                type="text"
                name="telefone"
                id="telefone"
                mask="(99) 99999-9999"
                placeholder="(99) 99999-9999"
              />
            </div>
            <div className="input">
              <img src={endereco_icon} alt="" />
              <input type="text" name="endereco" id="endereco" placeholder="Endereço" />
            </div>
            <div className="input">
              <img src={endereco_icon} alt="" />
              <input type="text" name="numero" id="numero" placeholder="Número" />
            </div>
            <div className="input">
              <img src={endereco_icon} alt="" />
              <InputMask
                type="text"
                name="cep"
                id="cep"
                mask="99999-999"
                placeholder="CEP"
              />
            </div>
            <div className="input">
              <img src={endereco_icon} alt="" />
              <input type="text" name="complemento" id="complemento" placeholder="Complemento" />
            </div>
            <div className="input">
              <img src={endereco_icon} alt="" />
              <input type="text" name="bairro" id="bairro" placeholder="Bairro" />
            </div>
            <div className="input">
              <img src={endereco_icon} alt="" />
              <input type="text" name="cidade" id="cidade" placeholder="Cidade" />
            </div>
            <div className="input">
              <img src={endereco_icon} alt="" />
              <select name="uf" id="uf" className="custom-select">
                <option value="">Selecione o UF</option>
                <option value="SP">SP</option>
                <option value="RJ">RJ</option>
                <option value="MG">MG</option>
              </select>
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
