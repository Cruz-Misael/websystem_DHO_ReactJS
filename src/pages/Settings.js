import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Para navegar entre páginas
import { FaArrowLeft } from 'react-icons/fa'; // Ícone de seta para voltar
import '../styles/Settings.css';
import logo from '../assets/logo.png';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const ConfigPage = ({ userEmail }) => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [accessLevel, setAccessLevel] = useState('');
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const handleSave = async () => {
    if (!name || !email || !accessLevel) {
      alert('Preencha todos os campos antes de salvar.');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/users`, {
        email,
        accessLevel,
      });
      fetchUsers();
      setName('');
      setEmail('');
      setAccessLevel('');
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`${API_BASE_URL}/users/${userId}`);
      fetchUsers(); // Atualiza a tabela após excluir
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  };

  const handleBack = () => {
    navigate('/'); // Redireciona para a tela inicial
  };

  return (
    <div className="config-page-container">
      <div className="config-content">
        <div className="form-container">
          <h2>Informações Pessoais:</h2>
          <div className="form-field">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite o email do usuário..."
            />
          </div>
          <div className="form-field">
            <label>Acesso:</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="radio"
                  name="accessLevel"
                  value="Admin"
                  checked={accessLevel === 'Admin'}
                  onChange={(e) => setAccessLevel(e.target.value)}
                />
                Admin
              </label>
              <label>
                <input
                  type="radio"
                  name="accessLevel"
                  value="User"
                  checked={accessLevel === 'User'}
                  onChange={(e) => setAccessLevel(e.target.value)}
                />
                User
              </label>
            </div>
          </div>
          <button className="save-button" onClick={handleSave}>
            Salvar
          </button>
        </div>

        <div className="table-container">
          <h2>Tabela de Usuários</h2>
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Acesso</th>
                <th>Excluir</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>,3
                  <td>{user.email}</td>
                  <td>{user.accessLevel}</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(user.id)}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConfigPage;
