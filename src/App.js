import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './page_Login';
import MainPage from './page_Main';
import Funcional from './page_Funcional';
import Recrutamento from './page_Recrutamento';
import Vagas from './page_Vagas';
import Departamento from './page_DP';
import BI from './page_BI';
import Configurações from './page_Config';
import ErroPopup from './Popup_Error';
import CadastroPage from './page_Cadastro'; // Importe a página de cadastro

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
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
                <Navigate to="/main" />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />

          <Route
            path="/main"
            element={
              isAuthenticated ? (
                <MainPage
                  userEmail={userEmail}
                  accessLevel={accessLevel}
                  onAccessDenied={handleAccessDenied} // Passa a função como prop
                />
              ) : (
                <Navigate to="/" /> 
              )
            }
          />

          <Route path="/funcional" element={isAuthenticated ? <Funcional /> : <Navigate to="/" />} />
          <Route path="/recrutamento" element={isAuthenticated ? <Recrutamento /> : <Navigate to="/" />} />
          <Route path="/vagas" element={isAuthenticated ? <Vagas userEmail={userEmail} /> : <Navigate to="/" />}/>
          <Route path="/dp" element={isAuthenticated ? <Departamento /> : <Navigate to="/" />} />
          <Route path="/bi" element={isAuthenticated ? <BI userEmail={userEmail} /> : <Navigate to="/" />} />
          <Route
            path="/config"
            element={accessLevel === 'ADMIN' ? (
              <Configurações
                userEmail={userEmail}
              />
            ) : (
              <Navigate to="/main" />
            )}
          />

          {/* Rota para a página de Cadastro */}
          <Route path="/cadastro" element={<CadastroPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
