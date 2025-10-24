import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Opportunity.css";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const VagasPage = () => {
  const [vagas, setVagas] = useState([]);
  const [filteredVagas, setFilteredVagas] = useState([]);
  const [filters, setFilters] = useState({});
  const [columns, setColumns] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedVaga, setSelectedVaga] = useState(null);
  const [newVaga, setNewVaga] = useState({
    open_opportunity_date: "",
    position_id: "",
    team_id: "",
    departament_id: "",
    opportunity_motive_id: "",
    replaced_person_id: "",
    base_origin_id: "",
    opportunity_status_id: "",
    deadline_sla_days: "",
    accept_date: "",
    responsible_recruiter_id: "",
    observations: "",
  });

  const fieldLabels = {
    id: "ID",
    open_opportunity_date: "Data de Abertura",
    position_id: "Cargo",
    team_id: "Time",
    departament_id: "Departamento",
    opportunity_motive_id: "Motivo",
    replaced_person_id: "Pessoa Substituída",
    base_origin_id: "Origem",
    opportunity_status_id: "Status",
    deadline_sla_days: "Prazo (dias)",
    accept_date: "Data de Aceite",
    responsible_recruiter_id: "Recrutador",
    observations: "Observações",
  };

  useEffect(() => {
    fetchVagas();
  }, []);

  const fetchVagas = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/opportunities`);
      const data = res.data || [];
      setVagas(data);
      setFilteredVagas(data);
      if (data.length > 0) setColumns(Object.keys(data[0]));
    } catch (err) {
      console.error("Erro ao buscar oportunidades:", err);
    }
  };

  const handleFilterChange = (column, value) => {
    const newFilters = { ...filters, [column]: value };
    setFilters(newFilters);
    const filtered = vagas.filter((vaga) =>
      Object.entries(newFilters).every(([col, val]) =>
        val ? vaga[col]?.toString().toLowerCase().includes(val.toLowerCase()) : true
      )
    );
    setFilteredVagas(filtered);
  };

  const handleOpenPopup = (vaga = null) => {
    setEditMode(!!vaga);
    setSelectedVaga(vaga);
    setNewVaga(vaga || {
      open_opportunity_date: "",
      position_id: "",
      team_id: "",
      departament_id: "",
      opportunity_motive_id: "",
      replaced_person_id: "",
      base_origin_id: "",
      opportunity_status_id: "",
      deadline_sla_days: "",
      accept_date: "",
      responsible_recruiter_id: "",
      observations: "",
    });
    setShowPopup(true);
  };

  const handleSave = async () => {
    try {
      if (editMode && selectedVaga?.id) {
        await axios.put(`${API_BASE_URL}/opportunities/${selectedVaga.id}`, newVaga);
        alert("Vaga atualizada com sucesso!");
      } else {
        await axios.post(`${API_BASE_URL}/opportunities`, newVaga);
        alert("Vaga criada com sucesso!");
      }
      setShowPopup(false);
      fetchVagas();
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar a vaga.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta vaga?")) {
      try {
        await axios.delete(`${API_BASE_URL}/opportunities/${id}`);
        alert("Vaga excluída com sucesso!");
        fetchVagas();
      } catch (err) {
        console.error("Erro ao excluir:", err);
      }
    }
  };

  return (
<div className="vagas-container">
  <div className="table-header">
    <h2 className="title">Gerenciamento de Oportunidades</h2>
    <button className="add-button" onClick={() => handleOpenPopup()}>
      + Nova Oportunidade
    </button>
  </div>

  <div className="table-container">
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col}>
              {fieldLabels[col] || col}
              <input
                type="text"
                placeholder="Filtrar..."
                value={filters[col] || ""}
                onChange={(e) => handleFilterChange(col, e.target.value)}
              />
            </th>
          ))}
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {filteredVagas.length > 0 ? (
          filteredVagas.map((vaga, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col}>{vaga[col]}</td>
              ))}
              <td className="actions-cell">
                <button className="edit-btn" onClick={() => handleOpenPopup(vaga)}>✏️</button>
                <button className="delete-btn" onClick={() => handleDelete(vaga.id)}>🗑️</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length + 1} className="no-data">
              Nenhuma oportunidade encontrada.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {showPopup && (
    <div className="popup-overlay" onClick={() => setShowPopup(false)}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>{editMode ? "Editar Oportunidade" : "Nova Oportunidade"}</h3>
        </div>
        <div className="popup-body">
          {Object.keys(newVaga).map((field) => (
            <div className="popup-row" key={field}>
              <label>{fieldLabels[field] || field}</label>
              <input
                type={field.includes("date") ? "date" : "text"}
                value={newVaga[field] || ""}
                onChange={(e) => setNewVaga({ ...newVaga, [field]: e.target.value })}
              />
            </div>
          ))}
        </div>
        <div className="popup-footer">
          <button className="cancel-btn" onClick={() => setShowPopup(false)}>Cancelar</button>
          <button className="save-btn" onClick={handleSave}>Salvar</button>
        </div>
      </div>
    </div>
  )}
</div>

  );
};

export default VagasPage;
