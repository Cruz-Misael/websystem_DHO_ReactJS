import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importando o hook para navegação
import '../styles/Login.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate(); // Hook para navegação

  const handleLogin = async () => {
    console.log(email, password)
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();
  
      const data = JSON.parse(text); // Tenta parsear depois
      if (data.success) {
        console.log("Chamando onLogin com:", data.accessLevel);
        onLogin(email, data.accessLevel);
      } else {
        setErrorMessage(data.message);
      }
    } catch (err) {
      console.error("Erro na requisição:", err.message);
      setErrorMessage(`Erro ao conectar ao servidor: ${err.message}`);
    }
  };

  const handleRegister = () => {
    // Navega para a página de cadastro
    navigate('/cadastro');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <div className="login-field">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu email"
        />
      </div>
      <div className="login-field">
        <label>Senha:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite sua senha"
        />
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button className="login-button" onClick={handleLogin}>
        Entrar
      </button>
      <button className="register-button" onClick={handleRegister}>
        Se Cadastrar
      </button>
    </div>
  );
}

export default LoginPage;
