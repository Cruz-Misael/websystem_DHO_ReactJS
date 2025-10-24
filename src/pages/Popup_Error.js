import React from 'react';
import '../styles/Popup.css'; // Arquivo de estilo para o popup

function ErroPopup({ message, onClose }) {
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2 className="popup-title">Acesso Negado</h2>
        <p className="popup-message">{message}</p>
        <button className="popup-button" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
}

export default ErroPopup;
