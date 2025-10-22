// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { toast } from "react-toastify";

/*
  Panel de administración simple:
  - Lista usuarios (ejemplo)
  - Podrías añadir acciones como cambiar roles, eliminar usuarios, etc.
*/
export default function AdminPanel() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth/users"); // OJO: debe existir esta ruta en backend para listar usuarios (solo admin)
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar usuarios. Asegúrate de tener la ruta /auth/users implementada en backend.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="page">
      <h2>Panel de Administración</h2>
      <p>Desde aquí puedes gestionar usuarios (ejemplo).</p>
      <table className="admin-table">
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th></tr>
        </thead>
        <tbody>
          {users.length === 0 && <tr><td colSpan="4">No hay usuarios o la ruta no está implementada.</td></tr>}
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
