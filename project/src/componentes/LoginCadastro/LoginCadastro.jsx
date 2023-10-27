import React, { useState } from 'react';
import './LoginCadastro.css';
import user_icon from '../Imgs/user.png';
import email_icon from '../Imgs/email.png';
import senha_icon from '../Imgs/senha.png';
import cpf_icon from '../Imgs/cpf_icon.png';
import InputMask from 'react-input-mask';
import telefone_icon from '../Imgs/telefone_icon.png'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

export const LoginCadastro = () => {
  const [action, setAction] = useState("Login");

  const navigate = useNavigate();

  const handlePainelDeControleClick = () => {
    navigate('/PainelDeControle');
  };

  const [isLoading, setIsLoading] = useState(false);

  //#region Cadastro de Usuário

  const handleCadastro = () => {
    setIsLoading(true);
  
    const novoUsuario = {
      cpf: document.getElementById('cpf').value,
      nomeCompleto: document.getElementById('nome').value,
      email: document.getElementById('email').value,
      senha: document.getElementById('senha').value,
      telefone: document.getElementById('telefone').value,
      isActive: true,
      tipoUsuarioId: 2,
    };

  
    setTimeout(() => {
      axios
        .post('http://localhost:5009/api/Usuario/cadastro', novoUsuario)
        .then((response) => {
          console.log('Cadastro realizado com sucesso!', response.data);
          navigate('/PainelDeControle');
        })
        .catch((error) => {
          console.error('Erro ao cadastrar o usuário:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 1000);
  };
  //#endregion

  return (
    <div className='container'>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        {action === "Login" ? (
          <>
            <div className="input">
              <img src={email_icon} alt="" />
              <input type="email" name="email" id="email" placeholder="Email" />
            </div>
            
            <div className="input">
              <img src={senha_icon} alt="" />
              <input type="password" name="senha" id="senha" placeholder="Senha" />
            </div>
          </>
        ) : (
          <>
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
            {action === "Cadastre-se" && (
              <>
              </>
            )}
          </>
        )}
      </div>
      {action !== "Cadastre-se" && (
        <div className="forgot-password">Esqueceu a senha? <span>Clique aqui para Recuperar!</span></div>
      )}
      {action !== "Cadastre-se" && (
        <div className="sign-up">Não tem um Login? <span onClick={() => { setAction("Cadastre-se") }}>Cadastre-se!</span></div>
      )}
      {action !== "Login" && (
        <div className="sign-up">Já tem cadastro? <span onClick={() => { setAction("Login") }}>Faça o Login!</span></div>
      )}
      <div className="submit-container">
        {action === "Login" ? null : (
          <div className="submit" onClick={handleCadastro}>Cadastrar</div>
        )}
        {action === "Cadastre-se" ? null : (
          <div className="submit" onClick={handlePainelDeControleClick}>Login</div>
        )}
      </div>
    </div>
  );
};


export default LoginCadastro;