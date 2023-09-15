import React, { useState } from 'react';
import './LoginCadastro.css';
import user_icon from '../Imgs/user.png';
import email_icon from '../Imgs/email.png';
import senha_icon from '../Imgs/senha.png';
import cpf_icon from '../Imgs/cpf_icon.png';
import InputMask from 'react-input-mask';
import endereco_icon from '../Imgs/endereco_icon.png'
import telefone_icon from '../Imgs/telefone_icon.png'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

export const LoginCadastro = () => {
  const handleSearchCEP = () => {
    const cep = document.getElementById('cep').value;
    axios.get(`https://viacep.com.br/ws/${cep}/json/`)
      .then(response => {
        const cepData = response.data;
        console.log('Dados do CEP:', cepData);
  
        document.getElementById('logradouro').value = cepData.logradouro;
        document.getElementById('bairro').value = cepData.bairro;
        document.getElementById('localidade').value = cepData.localidade;
        document.getElementById('uf').value = cepData.uf;
  
      })
      .catch(error => {
        console.error('Erro ao buscar o CEP:', error);
      });
  };
  const [action, setAction] = useState("Login");

  const navigate = useNavigate();

  const handlePainelDeControleClick = () => {
    navigate('/PainelDeControle');
  };

  return (
    <div className='container'>
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
                <button
                  id="buscar2"
                  onClick={handleSearchCEP}
                  >
                  Buscar
                  </button>
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
            {action === "Cadastre-se" && (
              <>
                <div className="input">
                  <img src={endereco_icon} alt="" />
                  <input type="text" name="numero" id="numero" placeholder="Número" />
                </div>
              
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
          <div className="submit" onClick={() => { setAction("Cadastre-se") }}>Cadastrar</div>
        )}
        {action === "Cadastre-se" ? null : (
          <div className="submit" onClick={handlePainelDeControleClick}>Login</div>
        )}
      </div>
    </div>
  );
};


export default LoginCadastro;