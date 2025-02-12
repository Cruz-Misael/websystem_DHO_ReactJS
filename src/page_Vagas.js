import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './indexVagas.css';
import { FaArrowLeft } from 'react-icons/fa'; // Ícone de seta para voltar
import { useNavigate } from 'react-router-dom'; // Para navegar entre páginas
import logo from './logo.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Estilos do DatePicker

const API_BASE_URL = process.env.REACT_APP_API_URL;


const VagasPage = ({ userEmail }) => {
  const [vagas, setVagas] = useState([]); // Dados originais
  const [filteredVagas, setFilteredVagas] = useState([]); // Dados filtrados
  const [columns, setColumns] = useState([]); // Nomes das colunas
  const [filters, setFilters] = useState({}); // Filtros para as colunas
  const [showPopup, setShowPopup] = useState(false); // Controle do popup
  const [newRow, setNewRow] = useState({}); // Dados da nova linha
  const navigate = useNavigate(); // Hook para navegação
  const [formOptions, setFormOptions] = useState({});
  const requiredFields = ['CARGO', 'MOTIVO', 'AREA', 'LOCAL', 'PRAZO', 'DATA ABERTURA', 'TIME', 'STATUS'];




  const handleBack = () => {
    navigate('/'); // Redireciona para a tela inicial
  };
  
  useEffect(() => {
    fetchVagas();
  }, []);

  const fetchVagas = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/opportunities`);
      if (response.data.length > 0) {
        setVagas(formatDates(response.data)); // Formata as datas
        setFilteredVagas(formatDates(response.data));
        setColumns(Object.keys(response.data[0]));
        setFilters(
          Object.keys(response.data[0]).reduce((acc, column) => {
            acc[column] = '';
            return acc;
          }, {})
        );
      }
    } catch (error) {
      console.error('Erro ao buscar vagas:', error);
    }
  };


  const formatDates = (data) => {
    return data.map((item) => {
      const formattedItem = { ...item };
      for (const key in formattedItem) {
        if (formattedItem[key] && /^\d{4}-\d{2}-\d{2}T/.test(formattedItem[key])) {
          // Extrai a data correta (ignora a hora e o fuso horário)
          const [year, month, day] = formattedItem[key].split('T')[0].split('-');
          formattedItem[key] = `${day}/${month}/${year}`; // Formata como dd/mm/yyyy
        }
      }
      return formattedItem;
    });
  };
  
  

  const handleFilterChange = (column, value) => {
    setFilters({ ...filters, [column]: value });

    const filtered = vagas.filter((vaga) => {
      return Object.entries({ ...filters, [column]: value }).every(([col, filterValue]) => {
        if (!filterValue) return true;
        return vaga[col]?.toString().toLowerCase().includes(filterValue.toLowerCase());
      });
    });

    setFilteredVagas(filtered);
  };


  
  const handleAddRow = async () => {
    // Verifica se todos os campos obrigatórios estão preenchidos
    const missingFields = requiredFields.filter((field) => !newRow[field]);
  
    if (missingFields.length > 0) {
      alert(`Os seguintes campos são obrigatórios e não foram preenchidos: ${missingFields.join(', ')}`);
      return; // Interrompe o processo se houver campos ausentes
    }
  
    console.log("Dados a serem salvos:", newRow); // Verifica se os dados estão corretos
  
    try {
      const response = await axios.post(`${API_BASE_URL}/opportunities`, newRow);
      if (response.status === 201) {
        alert('Vaga criada com sucesso!');
        fetchVagas(); // Atualiza os dados após salvar
        setShowPopup(false); // Fecha o popup
        setNewRow({}); // Reseta os dados da nova linha
      } else {
        console.error("Erro inesperado ao salvar:", response);
        alert('Erro ao salvar a vaga. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao criar vaga:',  error.message, error.stack);;
      alert('Erro ao salvar a vaga. Tente novamente.');
    }
  };
  
  
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/form-options`);
        setFormOptions(response.data);
      } catch (error) {
        console.error('Erro ao buscar opções do formulário:', error);
      }
    };
  
    fetchOptions();
  }, []);
  return (
    <div className="vagas-container">
      <header className="app-header">
        <img src={logo} alt="Logo" className="app-logo" />
        <h1 className="app-title">Configurações de Usuários</h1>
        <div className="user-info">Bem-vindo, {userEmail}</div>
      </header>
      <button className="back-button" onClick={handleBack}>
        <FaArrowLeft /> Voltar
      </button>
      <button className="add-button" onClick={() => setShowPopup(true)}>
        + Adicionar Nova Linha
      </button>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>
                  {col}
                  <input
                    type="text"
                    placeholder={`Filtrar ${col}`}
                    value={filters[col] || ''}
                    onChange={(e) => handleFilterChange(col, e.target.value)}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredVagas.length > 0 ? (
              filteredVagas.map((vaga, index) => (
                <tr key={index}>

                  {columns.map((col) => (
                    <td key={col}>{vaga[col]}</td>
                  ))}
                  
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center' }}>
                  Nenhum dado encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showPopup && (
  <div className="popup">
    <div className="popup-content">
      <h2>Adicionar Nova Linha</h2>
        {columns
          .filter((col) => col.toLowerCase() !== 'id') // Exclui a coluna 'ID'
          .map((col) => (
            <div key={col} className="popup-row">
              <label>
                {col}
                {requiredFields.includes(col) && <span style={{ color: 'red' }}> *</span>}
              </label>
              {['CARGO', 'MOTIVO', 'TIME', 'AREA', 'LOCAL', 'RECRUTADOR', 'GESTOR'].includes(col) ? (
                <select
                  value={newRow[col] || ''}
                  onChange={(e) => setNewRow({ ...newRow, [col]: e.target.value })}
                >
                  <option value="">Selecione</option>
                  {formOptions[col]?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : col === 'PRAZO' ? (
                <input
                  type="number"
                  value={newRow[col] || ''}
                  onChange={(e) => setNewRow({ ...newRow, [col]: e.target.value })}
                  min="0"
                  step="1"
                />
              ) : col.toLowerCase().includes('data') || col.toLowerCase().includes('date') ? (
                <DatePicker
                  selected={newRow[col] ? new Date(newRow[col]) : null}
                  onChange={(date) => setNewRow({ ...newRow, [col]: date.toISOString() })}
                  dateFormat="dd/MM/yyyy"
                  className="datepicker-input"
                />
              ) : (
                <input
                  type="text"
                  value={newRow[col] || ''}
                  onChange={(e) => setNewRow({ ...newRow, [col]: e.target.value })}
                />
              )}
            </div>
          ))}
        <div className="popup-actions">
          <button onClick={() => setShowPopup(false)}>Cancelar</button>
          <button onClick={handleAddRow}>Salvar</button>
        </div>
      </div>
    </div>
  )}
    </div>
  );
};

export default VagasPage;
