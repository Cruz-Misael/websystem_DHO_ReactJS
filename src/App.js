import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import MainPage from './pages/Main'; // Importe o MainPage
import Funcional from './pages/Functional';
import Recrutamento from './pages/Recruitment';
import Vagas from './pages/Opportunity';
import Departamento from './pages/PD';
import BI from './pages/BI';
import Configurações from './pages/Settings';
import ErroPopup from './pages/Popup_Error';
import CadastroPage from './pages/Register';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userEmail, setUserEmail] = useState('teste@teste.com');
  const [accessLevel, setAccessLevel] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const handleLogin = (email, accessLevel) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    setAccessLevel(accessLevel);
  };

  const closePopup = () => {
    setShowErrorPopup(false);
  };

  const handleAccessDenied = () => {
    setShowErrorPopup(true);
  };

  return (
    <Router>
      <div>
        {showErrorPopup && (
          <ErroPopup
            message="Você não tem permissão para acessar a página de configurações."
            onClose={closePopup}
          />
        )}

        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/main" /> // Redireciona para o MainPage após o login
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />

          {/* Rota principal que usa o MainPage como layout */}
          <Route
            path="/main"
            element={
              isAuthenticated ? (
                <MainPage
                  userEmail={userEmail}
                  accessLevel={accessLevel}
                  onAccessDenied={handleAccessDenied}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          >
            {/* Rotas filhas que serão renderizadas dentro do Outlet do MainPage */}
            <Route path="bi" element={<BI userEmail={userEmail} />} />
            <Route path="funcional" element={<Funcional />} />
            <Route path="recrutamento" element={<Recrutamento />} />
            <Route path="vagas" element={<Vagas userEmail={userEmail} />} />
            <Route path="dp" element={<Departamento />} />
            <Route
              path="config"
              element={
                accessLevel === 'ADMIN' ? (
                  <Configurações userEmail={userEmail} />
                ) : (
                  <Navigate to="/main" />
                )
              }
            />
          </Route>

          {/* Rota para a página de Cadastro */}
          <Route path="/cadastro" element={<CadastroPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;