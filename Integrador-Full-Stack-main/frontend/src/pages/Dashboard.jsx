// src/pages/Dashboard.jsx
import React, { useContext, useState } from "react";
import TaskList from "../components/TaskList";
import { AuthContext } from "../context/AuthContext";

/*
  Página principal elegante del usuario:
  - Diseño moderno con tema dorado, blanco y azul suave
  - Bienvenida personalizada con nombre del usuario
  - Estadísticas de productividad
  - Lista de tareas con funcionalidades avanzadas
  - Diseño responsivo para móviles
  - Animaciones suaves y efectos visuales
*/
export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showTasks, setShowTasks] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, completionRate: 0 });
  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header de bienvenida */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">¡Bienvenido, {user?.name || 'Usuario'}!</h1>
          <p className="dashboard-subtitle">Gestiona tus tareas de manera eficiente y mantén tu productividad al máximo</p>

          {/* Estadísticas rápidas */}
          <div className="quick-stats">
            <div className="quick-stat-item">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="stat-content">
                <h3>Productividad</h3>
                <p>Mantén el control de tus tareas</p>
              </div>
            </div>

            <div className="quick-stat-item">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="stat-content">
                <h3>Organización</h3>
                <p>Estructura tus actividades diarias</p>
              </div>
            </div>

            <div className="quick-stat-item">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="stat-content">
                <h3>Eficiencia</h3>
                <p>Optimiza tu tiempo y recursos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Nueva sección: estadísticas y controles de tareas */}
        <div className="dashboard-stats" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 16 }}>
          <div className="stats-cards" style={{ display: 'flex', gap: 12 }}>
            <div className="stat-card">
              <h4>Total</h4>
              <p>{stats.total}</p>
            </div>
            <div className="stat-card">
              <h4>Pendientes</h4>
              <p>{stats.pending}</p>
            </div>
            <div className="stat-card">
              <h4>Completadas</h4>
              <p>{stats.completed}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button className="view-btn" onClick={() => setShowTasks(s => !s)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{ marginLeft: 8 }}>{showTasks ? 'Ocultar tareas' : 'Ver tareas'}</span>
            </button>

            <button className="create-btn" onClick={() => setShowCreateForm(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{ marginLeft: 8 }}>Crear tarea</span>
            </button>
          </div>
        </div>

        {/* Lista de tareas */}
        <div className="page-container" style={{ marginTop: 18 }}>
          <TaskList visible={showTasks} showForm={showCreateForm} setShowForm={setShowCreateForm} onStatsChange={(s) => setStats(s)} />
        </div>
      </div>
    </div>
  );
}
