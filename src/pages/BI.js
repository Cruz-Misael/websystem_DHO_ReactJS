import React from 'react';
import '../styles/PowerBI.css';
import logo from '../assets/logo.png';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const BI = ({ userEmail }) => {
  return (
    <div className="app-container">
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