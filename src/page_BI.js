import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importando o useNavigate
import './indexBI.css';
import { FaArrowLeft } from 'react-icons/fa'; // Ícone de seta para voltar
import logo from './logo.png';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const BI = ({ userEmail }) => {
  const navigate = useNavigate(); // Usando o hook useNavigate

  const handleBack = () => {
    navigate('/'); // Redireciona para a tela inicial
  };

  return (
    <div className="app-container">

      <header className="app-header">
        <img src={logo} alt="Logo" className="app-logo" />
        <h1 className="app-title">Power BI - Quadros DHO</h1>
        <div className="user-info">Bem-vindo, {userEmail}</div>
      </header>

      <button className="back-button" onClick={handleBack}>
        <FaArrowLeft /> Voltar
      </button>
      
      <main className="cards-grid">
        <div className="card">
          <h2>DHO - Desligamentos</h2>
          <a 
            href="https://app.powerbi.com/view?r=eyJrIjoiZGNmNGFjOWUtY2NkMy00MTkzLWI4NTktZmY5MzllOTNlMWY3IiwidCI6IjAyMmVlMDEzLTcyMGMtNGJlYi1hMTY2LWFhZjBhZTI2ODE2NiJ9" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Ver Power BI
          </a>
        </div>

        <div className="card">
          <h2>DHO - Entrevistas de Desligamentos</h2>
          <a 
            href="https://app.powerbi.com/view?r=eyJrIjoiMGQ4OTY2MTMtY2RhYS00MGNhLWE2ZDQtZjYxZjliZmRmOTM2IiwidCI6IjAyMmVlMDEzLTcyMGMtNGJlYi1hMTY2LWFhZjBhZTI2ODE2NiJ9" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Ver Power BI
          </a>
        </div>

        <div className="card">
          <h2>DHO - Painel de Vagas</h2>
          <a 
            href="https://app.powerbi.com/view?r=eyJrIjoiZmI0ZTRhZDYtYjBjNS00ZDQyLTk0NDktMTBhMDk4ZDRlNmQ2IiwidCI6IjAyMmVlMDEzLTcyMGMtNGJlYi1hMTY2LWFhZjBhZTI2ODE2NiJ9" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Ver Power BI
          </a>
        </div>

        <div className="card">
          <h2>DHO - Quadro Funcional</h2>
          <a 
            href="https://app.powerbi.com/view?r=eyJrIjoiODc1YWQ3ZWItMmQzYS00ODc0LWFmNjktMzkzNGI4NTU2YTZlIiwidCI6IjAyMmVlMDEzLTcyMGMtNGJlYi1hMTY2LWFhZjBhZTI2ODE2NiJ9" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Ver Power BI
          </a>
        </div>
      </main>
    </div>
  );
};

export default BI;
