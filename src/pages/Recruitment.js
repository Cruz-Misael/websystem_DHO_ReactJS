import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Functional.css";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const fieldLabels = {
  profile_image: "Foto",
  registration_number: "Matrícula",
  name: "Nome",
  phone_number: "Telefone",
  cpf: "CPF",
  rg: "RG",
  date_birth: "Data Nascimento",
  sex: "Sexo",
  replacement: "Substituição",
  recruitment_data: "Dados Recrutamento",
  adimission_date: "Data Admissão",
  demissal_date: "Data Demissão",
  observations: "Observações",
  professional_references: "Referências Profissionais",
  collaborator_knowledge: "Conhecimento Colaborador",
  labor_lawsuit: "Processo Trabalhista",
  criminal_background: "Antecedentes Criminais",
  external_link: "Link Externo",
  mindsigth_link: "Link Mindsigth",
  cis_link: "Link CIS",
  id_opportunity: "ID Oportunidade",
  id_position: "ID Cargo",
  id_team: "ID Time",
  id_departament: "ID Área",
  id_base_origin: "ID Origem",
  id_demission_type: "ID Tipo Demissão",
  id_demissal_motivation: "ID Motivo Demissão",
  id_education: "ID Educação",
  id_recruitment_source: "ID Fonte Recrutamento",
  id_process_stage: "ID Etapa Processo",
  id_process_status: "ID Status Processo",
  id_situation: "Situação",
};

export default function PeoplePage() {
  const [people, setPeople] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filters, setFilters] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [newPerson, setNewPerson] = useState({});
  const [editMode, setEditMode] = useState(false);

  // situações vindas do backend
  const [situations, setSituations] = useState([]); // array de { id, name, description }
  const [situationsMap, setSituationsMap] = useState({}); // mapa id -> name

  useEffect(() => {
    // carrega situações e pessoas em paralelo
    const loadAll = async () => {
      try {
        const [sitRes, peopleRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/situation`),
          axios.get(`${API_BASE_URL}/people`),
        ]);

        const sitData = Array.isArray(sitRes.data) ? sitRes.data : [];
        const pplData = Array.isArray(peopleRes.data) ? peopleRes.data : [];

        // cria mapa id -> name
        const map = sitData.reduce((acc, s) => {
          // assume que o id está em s.id (se no seu backend for _id, ajuste aqui)
          acc[String(s.id ?? s._id ?? s._oid ?? "")] = s.name ?? s.situation_name ?? "";
          return acc;
        }, {});
        setSituations(sitData);
        setSituationsMap(map);

        // filtrar permanentemente: remove quem tem situação "Recrutamento"
        const filtered = pplData.filter((p) => {
          const sitId = String(p.id_situation ?? p.idSituation ?? p.id_situacao ?? "");
          const sitName = map[sitId] ?? "";
          return sitName.toLowerCase() === "recrutamento";
        });

        setPeopleAndColumns(filtered);
      } catch (err) {
        console.error("Erro ao carregar pessoas ou situações:", err);
        // fallback: tenta somente pessoas sem filtro se houver erro nas situações
        try {
          const peopleRes = await axios.get(`${API_BASE_URL}/people`);
          setPeopleAndColumns(Array.isArray(peopleRes.data) ? peopleRes.data : []);
        } catch (e) {
          console.error("Erro fallback ao buscar people:", e);
        }
      }
    };

    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // helper para setar people, filteredPeople, columns e filtros iniciais
  const setPeopleAndColumns = (peopleArray) => {
    setPeople(peopleArray);
    setFilteredPeople(peopleArray);
    if (peopleArray.length > 0) {
      setColumns(Object.keys(peopleArray[0]));
      setFilters(
        Object.keys(peopleArray[0]).reduce((acc, col) => {
          acc[col] = "";
          return acc;
        }, {})
      );
    } else {
      setColumns([]);
      setFilters({});
    }
  };

  // Função que retorna o valor a ser exibido na célula (substitui id_situation pelo name)
  const displayValue = (person, col) => {
    if (col === "id_situation") {
      const sitId = String(person.id_situation ?? "");
      return situationsMap[sitId] ?? person[col] ?? "-";
    }
    // se quiser formatar datas aqui, faça
    return person[col] ?? "";
  };

  // handle filter: quando filtra pela coluna id_situation, usa o nome da situação
  const handleFilterChange = (col, value) => {
    const newFilters = { ...filters, [col]: value };
    setFilters(newFilters);

    const filtered = people.filter((p) =>
      Object.entries(newFilters).every(([k, v]) => {
        if (!v) return true;
        const cell = k === "id_situation" ? (situationsMap[String(p.id_situation ?? "")] ?? "") : String(p[k] ?? "");
        return cell.toLowerCase().includes(v.toLowerCase());
      })
    );

    setFilteredPeople(filtered);
  };

  const handleOpenPopup = (person = null) => {
    if (person) {
      setNewPerson(person);
      setEditMode(true);
    } else {
      setNewPerson({});
      setEditMode(false);
    }
    setShowPopup(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir este registro?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/people/${id}`);
      // recarrega dados (mantendo o filtro permanente)
      await reloadPeople();
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  };

  const reloadPeople = async () => {
    try {
      const peopleRes = await axios.get(`${API_BASE_URL}/people`);
      const pplData = Array.isArray(peopleRes.data) ? peopleRes.data : [];
      // aplica filtro permanente usando mapa atual
      const filtered = pplData.filter((p) => {
        const sitId = String(p.id_situation ?? "");
        const sitName = situationsMap[sitId] ?? "";
        return sitName.toLowerCase() === "recrutamento";
      });
      setPeopleAndColumns(filtered);
    } catch (err) {
      console.error("Erro ao recarregar people:", err);
    }
  };

  const handleSave = async () => {
    try {
      // garante que id_situation enviado é number (ou string, dependendo do backend)
      const payload = {
        ...newPerson,
        id_situation: newPerson.id_situation !== undefined ? Number(newPerson.id_situation) : undefined,
      };

      if (editMode && newPerson.id) {
        await axios.put(`${API_BASE_URL}/people/${newPerson.id}`, payload);
      } else {
        await axios.post(`${API_BASE_URL}/people`, payload);
      }

      setShowPopup(false);
      setNewPerson({});
      await reloadPeople();
    } catch (err) {
      console.error("Erro ao salvar a pessoa. ", err);
      alert("Erro ao salvar a pessoa. Verifique os campos no console.");
    }
  };

  return (
    <div className="vagas-container">
      <div className="table-header">
        <h2 className="title">Gerenciamento de Pessoas</h2>
        <button className="add-button" onClick={() => handleOpenPopup()}>
          + Nova Pessoa
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
            {filteredPeople.length > 0 ? (
              filteredPeople.map((person, i) => (
                <tr key={person.id ?? i}>
                  {columns.map((col) => (
                    <td key={col}>{displayValue(person, col)}</td>
                  ))}

                  <td className="actions-cell">
                    <button className="edit-btn" onClick={() => handleOpenPopup(person)}>✏️</button>
                    <button className="delete-btn" onClick={() => handleDelete(person.id)}>🗑️</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="no-data">
                  Nenhuma pessoa encontrada.
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
              <h3>{editMode ? "Editar Pessoa" : "Nova Pessoa"}</h3>
            </div>

            <div className="popup-body">
              {columns.map((field) => (
                <div className="popup-row" key={field}>
                  <label>{fieldLabels[field] || field}</label>

                  {field === "id_situation" ? (
                    <select
                      value={newPerson[field] ?? ""}
                      onChange={(e) => setNewPerson({ ...newPerson, [field]: e.target.value })}
                    >
                      <option value="">Selecione...</option>
                      {situations.map((s) => {
                        // usa s.id ou _id conforme sua API
                        const sid = String(s.id ?? s._id ?? s._oid ?? "");
                        const sname = s.name ?? s.situation_name ?? "";
                        return (
                          <option key={sid} value={sid}>
                            {sname}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <input
                      type={field.includes("date") ? "date" : "text"}
                      value={newPerson[field] ?? ""}
                      onChange={(e) => setNewPerson({ ...newPerson, [field]: e.target.value })}
                    />
                  )}
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
}
