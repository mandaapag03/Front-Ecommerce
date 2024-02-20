import React, { useState, useEffect } from 'react';
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
import telefone_icon from '../Imgs/telefone_icon.png'
import axios from 'axios'


function App() {
  const [isLoading, setIsLoading] = useState(false);


  const handleSave = async () => {
    setIsLoading(true);
    try {
      const requestBody = {
        cpf: document.getElementById('cpf').value,
        nomeCompleto: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value,
        telefone: document.getElementById('telefone').value,
        isActive: true,
        tipoUsuarioId: 2,
      };

      setTimeout(async () => {
        const response = await axios.post('http://localhost:5010/api/User/register', requestBody);
        console.log('Resposta da API:', response.data);
        closeModal();
        window.location.reload();
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao enviar a solicitação:', error);
    }
  };

  const [users, setUsers] = useState([]);

  const columns = [
    {
      name: 'Status',
      cell: (row) => (
        <span>{row.isActive ? 'Ativo' : 'Inativo'}</span>
      ),
    },
    {
      name: 'Nome',
      selector: 'nomeCompleto',
    },
    {
      name: 'Email',
      selector: 'email',
    },
    {
      name: 'Telefone',
      selector: 'telefone',
    },
    {
      name: 'Ações',
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
      ),
    },
  ];

  useEffect(() => {
    axios.get('http://localhost:5010/api/Usuario')
      .then((response) => {
        console.log(response.data)
        console.log('response.data')
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar usuários:', error);
      });
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

  const [records, setRecords] = useState(users);

  function handleFilter(event) {
    const newData = users.filter(row => {
      return row.name.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase())
    })
    setRecords(newData)
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

  //#region EDIÇÃO DE USUÁRIOS

  const [editingUser, setEditingUser] = useState(null);

  const handleEdit = async (row) => {
    try {
      const response = await fetch(`http://localhost:5010/api/User/find/${row.cpf}`);
      if (response.ok) {
        const userData = await response.json();
        setEditingUser(userData);
        openModalEdit();
      } else {
        console.error('Erro ao buscar os dados do usuário');
      }
    } catch (error) {
      console.error('Erro ao buscar os dados do usuário:', error);
    }
  };

  const handleFieldChange = (fieldName, value) => {
    const updatedUser = { ...editingUser };

    const fieldParts = fieldName.split('.');

    let currentField = updatedUser;
    for (let i = 0; i < fieldParts.length; i++) {
      const part = fieldParts[i];
      if (i === fieldParts.length - 1) {
        currentField[part] = value;
      } else {
        if (!currentField[part]) {
          currentField[part] = {};
        }
        currentField = currentField[part];
      }
    }

    setEditingUser(updatedUser);
  };


  const handleSaveEdit = async () => {
    setIsLoading(true);
    try {
      setTimeout(async () => {
        const response = await fetch('http://localhost:5010/api/User/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingUser),
        });

        if (response.ok) {
          closeModalEdit();
          window.location.reload();
        } else {
          console.error('Erro ao atualizar o usuário');
        }
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao atualizar o usuário:', error);
    }
  };

  //#endregion

  //#region INATIVAR USUÁRIO

  const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
  const [userIdToInactivate, setUserIdToInactivate] = useState(null);

  const handleConfirmInactivate = async () => {
    setIsLoading(true);
    try {
      setTimeout(async () => {
        const response = await fetch(`http://localhost:5010/api/User/inactivate/${userIdToInactivate}`, {
          method: 'PUT',
        });

        if (response.ok) {
          setConfirmationModalIsOpen(false);
          window.location.reload();
        } else {
          console.error('Erro ao inativar o usuário');
        }
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao inativar o usuário:', error);
    }
  };

  const handleInativar = (row) => {
    setUserIdToInactivate(row.id);
    setConfirmationModalIsOpen(true);
  };

  //#endregion

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const [modalIsOpenEdit, setModalIsOpenEdit] = useState(false);

  const openModalEdit = () => {
    setModalIsOpenEdit(true);
  };

  const closeModalEdit = () => {
    setModalIsOpenEdit(false);
  };

  return (
    <div className='container mt-5'>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
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
        </div>
      </div><br />
      <div className="custom-table-container">
        <DataTable
          columns={columns}
          data={users}
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
        contentLabel="Modal de Edicao de Usuario"
        style={customModalStyles}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Edição de Usuário</h2>
        <form>
          <div className="inputs">
            <div className="input">
              <img src={user_icon} alt="" />
              <input
                type="text"
                name="nomeCompleto"
                id="nomeCompleto"
                placeholder="Nome completo"
                maxLength="60"
                value={editingUser?.nomeCompleto || ''}
                onChange={(e) => handleFieldChange('nomeCompleto', e.target.value)}
              />
            </div>
            <div className="input">
              <img src={email_icon} alt="" />
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={editingUser?.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
              />
            </div>
            <div className="input">
              <img src={senha_icon} alt="" />
              <input
                type="password"
                name="senha"
                id="senha"
                placeholder="Senha"
                value={editingUser?.senha || ''}
                onChange={(e) => handleFieldChange('senha', e.target.value)}
              />
            </div>
            <div className="input">
              <img src={cpf_icon} alt="" />
              <InputMask
                type="text"
                name="cpf"
                id="cpf"
                mask="999.999.999-99"
                placeholder="CPF"
                value={editingUser?.cpf || ''}
                onChange={(e) => handleFieldChange('cpf', e.target.value)}
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
                value={editingUser?.telefone || ''}
                onChange={(e) => handleFieldChange('telefone', e.target.value)}
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
        onRequestClose={() => setConfirmationModalIsOpen(false)}
        contentLabel="Modal de Confirmação de Inativação"
        style={customModalStylesInativar}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          Deseja inativar este usuário?
        </h2>
        <div className="modal-buttons">
          <button
            id="botao-nao"
            onClick={() => setConfirmationModalIsOpen(false)}
          >
            Não
          </button>
          <button
            id="botao-sim"
            onClick={handleConfirmInactivate}
          >
            Sim
          </button>
        </div>
      </Modal>


    </div>
  )
}

export default App;
