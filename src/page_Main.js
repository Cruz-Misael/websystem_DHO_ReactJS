import React from 'react';
import { useNavigate } from 'react-router-dom';
import './indexMain.css';
import logo from './logo.png';

function MainPage({ userEmail, accessLevel, onAccessDenied }) {
  const navigate = useNavigate();


  const handleNavigation = (path, requiresAdmin) => {
    if (requiresAdmin && accessLevel !== 'ADMIN') {
      // Exibe o popup de erro se o usuário não for ADMIN
      onAccessDenied(); 
    } else {
      // Navega para o path correspondente
      navigate(path);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <img src={logo} alt="Logo" className="app-logo" />
        <h1 className="app-title">Quadros Desenvolvimento Humano</h1>
        <div className="user-info">Bem-vindo, {userEmail}</div> {/* Mostra o e-mail do usuário */}
      </header>

      <main className="button-grid">
        <button
          className="dynamic-button"
          onClick={() => handleNavigation('/funcional')}
        >
          Quadro Funcional
        </button>
        <button
          className="dynamic-button"
          onClick={() => handleNavigation('/recrutamento')}
        >
          Quadro Recrutamento
        </button>
        <button
          className="dynamic-button"
          onClick={() => handleNavigation('/vagas')}
        >
          Painel de Vagas
        </button>
        <button
          className="dynamic-button"
          onClick={() => handleNavigation('/dp')}
        >
          Quadro Departamento Pessoal
        </button>
        <button
          className="dynamic-button"
          onClick={() => handleNavigation('/bi')}
        >
          Power BI
        </button>
        <button
          className="dynamic-button"
          onClick={() => handleNavigation('/config', true)} // Configurações exige ADMIN
        >
          Configurações
        </button>
      </main>
    </div>
  );
}

export default MainPage;
