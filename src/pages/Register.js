import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importando o hook para navegação
import '../styles/Register.css';
import 'font-awesome/css/font-awesome.min.css'; 

const API_BASE_URL = process.env.REACT_APP_API_URL;

function CadastroPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEmailRegistered, setIsEmailRegistered] = useState(false); // Novo estado para verificar se o e-mail já tem senha

  const navigate = useNavigate();

  // Função para verificar se o e-mail já tem uma senha associada
  const checkEmailExists = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.exists) {
        setIsEmailRegistered(true); // O e-mail já tem senha
      } else {
        setIsEmailRegistered(false); // O e-mail não tem senha
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Erro ao verificar o e-mail.');
    }
  };

  // Função para lidar com a alteração da senha
  const handleChangePassword = async () => {
    if (isEmailRegistered) {
      setErrorMessage('Este e-mail já possui uma senha registrada. Não é possível alterá-la.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem!');
      return;
    }

    try {
      const response = await fetch('${API_BASE_URL}/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Senha alterada com sucesso!');
        // Navegar para login após sucesso
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setErrorMessage(data.message);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Erro ao alterar a senha.');
    }
  };

  // Função para voltar para a página de login
  const handleBackToLogin = () => {
    navigate('/');
  };

  return (
    <div className="page-cadastro-container">
          <button className="back-button" onClick={handleBackToLogin}>
    <i className="fa fa-arrow-left"></i> {/* Ícone de seta */}
    </button>
      <h2>Alterar Senha</h2>
      <div className="form-field">
        
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu email"
          onBlur={checkEmailExists} // Verifica o e-mail quando o campo perde o foco
        />
      </div>
      <div className="form-field">
        <label>Nova Senha:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite a nova senha"
        />
      </div>
      <div className="form-field">
        <label>Confirmar Senha:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirme a senha"
        />
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <button className="save-button" onClick={handleChangePassword}>Alterar Senha</button>
    

    </div>
  );
}

export default CadastroPage;
