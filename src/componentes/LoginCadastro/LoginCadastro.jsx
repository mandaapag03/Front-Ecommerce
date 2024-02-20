import React, { useState, useEffect } from 'react';
import './LoginCadastro.css';
import user_icon from '../Imgs/user.png';
import email_icon from '../Imgs/email.png';
import senha_icon from '../Imgs/senha.png';
import cpf_icon from '../Imgs/cpf_icon.png';
import InputMask from 'react-input-mask';
import telefone_icon from '../Imgs/telefone_icon.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export const LoginCadastro = () => {
  const [action, setAction] = useState("Login");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleAuthentication = async (userData) => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        action === "Login"
          ? 'http://localhost:5010/api/User/login'
          : 'http://localhost:5010/api/User/register',
        userData
      );
      console.log(action === "Login" ? 'Login bem-sucedido!' : 'Cadastro realizado com sucesso!', response.data);
      setToken(response.data.token);
      const userFullName = response.data.usuario.nomeCompleto || userData.nomeCompleto;
      const userDataToSave = { nomeCompleto: userFullName };
      saveUserDataAndToken(userDataToSave, response.data.token);
      navigate('/', { state: { nomeUsuario: userFullName } });
    } catch (error) {
      console.error(`Erro ao ${action === "Login" ? 'fazer login' : 'cadastrar o usuário'}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserDataAndToken = (userData, token) => {
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const handleSubmitCadastro = async () => {
    setIsLoading(true);
    try {
      const novoUsuario = {
        cpf,
        nomeCompleto: nome,
        email,
        senha,
        telefone,
        isActive: true,
        tipoUsuarioId: 2,
      };
      const response = await axios.post('http://localhost:5010/api/User/register', novoUsuario);
      console.log('Cadastro realizado com sucesso!', response.data);
      setToken(response.data.token);
      const userFullName = response.data?.usuario?.nomeCompleto || novoUsuario.nomeCompleto;
      const userDataToSave = { nomeCompleto: userFullName };
      saveUserDataAndToken(userDataToSave, response.data.token);
      navigate('/', { state: { nomeUsuario: userFullName } });
    } catch (error) {
      console.error('Erro ao cadastrar o usuário:', error);
    } finally {
      setIsLoading(false);
    }

  };
  const handleSubmit = async () => {
    const usuario = { email, senha };
    await handleAuthentication(usuario);
  };

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
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input">
              <img src={senha_icon} alt="" />
              <input
                type="password"
                name="senha"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
          </>
        ) : (
          <>
            <div className="input">
              <img src={user_icon} alt="" />
              <input
                type="text"
                name="nome"
                placeholder="Nome completo"
                maxLength="60"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="input">
              <img src={email_icon} alt="" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input">
              <img src={senha_icon} alt="" />
              <input
                type="password"
                name="senha"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
            <div className="input">
              <img src={cpf_icon} alt="" />
              <InputMask
                type="text"
                name="cpf"
                mask="999.999.999-99"
                placeholder="CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
            </div>
            <div className="input">
              <img src={telefone_icon} alt="" />
              <InputMask
                type="text"
                name="telefone"
                mask="(99) 99999-9999"
                placeholder="(99) 99999-9999"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>
          </>
        )}
      </div>
      {action !== "Login" && (
        <>
        </>
      )}
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
        <div className="submit" onClick={action === "Login" ? handleSubmit : handleSubmitCadastro}>
          {action === "Login" ? "Login" : "Cadastrar"}
        </div>
      </div>
    </div>
  );
};

export default LoginCadastro;
