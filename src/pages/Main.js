import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import '../styles/Main.css';
import logo from '../assets/logo.png';

function MainPage({ userEmail, accessLevel, onAccessDenied }) {
  const navigate = useNavigate();

  const handleNavigation = (path, requiresAdmin) => {
    if (requiresAdmin && accessLevel !== 'ADMIN') {
      onAccessDenied();
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="app">

        <div>
            <header className="app-header">
                <img src={logo} alt="Logo" className="app-logo" />
                <h3>Quadros - Desenvolvimento Humano</h3>
                <button className="logout-button" onClick={handleLogout}>Sair</button>
            </header>
        </div>

        <div className="app-layout">
            <nav className="app-menu">
                <button className="menu-button" onClick={() => handleNavigation('bi')}>Dashboards</button>
                <button className="menu-button" onClick={() => handleNavigation('funcional')}>Quadro Funcional</button>
                <button className="menu-button" onClick={() => handleNavigation('recrutamento')}>Quadro Recrutamento</button>
                <button className="menu-button" onClick={() => handleNavigation('vagas')}>Painel de Vagas</button>
                <button className="menu-button" onClick={() => handleNavigation('dp')}>Integração Colaboradores</button>
                <button className="menu-button" onClick={() => handleNavigation('config', true)}>Configurações</button>
            </nav>

            <main className="app-content">
                <Outlet /> {/* Aqui será carregado o conteúdo da página selecionada */}
            </main>
        </div>

    </div>
);
}

export default MainPage;