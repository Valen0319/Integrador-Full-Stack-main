// src/components/TaskList.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import api from "../api/axiosConfig";
import TaskForm from "./TaskForm";
import TaskCard from './TaskCard';
import { toast } from "react-toastify";
import { FiEdit } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import ConfirmDialog from './ConfirmDialog';

/*
  Lista elegante de tareas con diseño moderno:
  - Interfaz visual atractiva con tema dorado, blanco y azul suave
  - Animaciones suaves para interacciones
  - Estados de carga con feedback visual
  - Filtros y búsqueda de tareas
  - Estadísticas de productividad
  - Diseño responsivo para móviles
  - Confirmaciones elegantes para acciones destructivas
*/
export default function TaskList({ visible = true, showForm = false, setShowForm = null, onStatsChange = null }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [filter, setFilter] = useState('all'); // all, completed, pending
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default'); // default | due_nearest | due_farthest
  const [deletingId, setDeletingId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [movingIds, setMovingIds] = useState([]);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/tasks");
      const items = res.data || [];
      setTasks(items);
      // notify parent about stats if requested
      if (onStatsChange) {
        const stats = {
          total: items.length,
          completed: items.filter(t => t.completed).length,
          pending: items.filter(t => !t.completed).length,
          completionRate: items.length > 0 ? Math.round((items.filter(t => t.completed).length / items.length) * 100) : 0
        };
        try { onStatsChange(stats); } catch (e) { /* ignore callback errors */ }
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ No se pudieron cargar las tareas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const toggleComplete = useCallback(async (task) => {
    // start exit animation for this task
    setMovingIds(prev => Array.from(new Set([...prev, task.id])));

    // wait for animation to play before reordering
    const ANIM_MS = 220;
    setTimeout(async () => {
      // remove id from moving state
      setMovingIds(prev => prev.filter(id => id !== task.id));

      // optimistic update (toggle completed)
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: t.completed ? 0 : 1 } : t));

      try {
        await api.put(`/tasks/${task.id}`, { ...task, completed: task.completed ? 0 : 1 });
        toast.success(task.completed ? "📝 Tarea marcada como pendiente" : "✅ Tarea completada");
      } catch (err) {
        console.error(err);
        toast.error("❌ Error al actualizar tarea");
        // volver a cargar en caso de error
        fetchTasks();
      }
    }, ANIM_MS);
  }, [fetchTasks]);

  // Ejecuta la petición de borrado (llamada real a la API)
  const handleDelete = useCallback(async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("🗑️ Tarea eliminada correctamente");
      // optimista: filtrar la tarea localmente
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("❌ Error al eliminar tarea");
      // recargar en caso de fallo
      fetchTasks();
    } finally {
      setDeletingId(null);
    }
  }, [fetchTasks]);

  // Abrir diálogo de confirmación (no borra todavía)
  const openConfirm = useCallback((id) => {
    setConfirmId(id);
    setConfirmOpen(true);
  }, []);

  // Confirmar borrado desde el diálogo
  const confirmDelete = useCallback(async () => {
    if (!confirmId) return;
    setConfirmLoading(true);
    try {
      await api.delete(`/tasks/${confirmId}`);
      toast.success("🗑️ Tarea eliminada correctamente");
      setTasks(prev => prev.filter(t => t.id !== confirmId));
      setConfirmOpen(false);
      setConfirmId(null);
    } catch (err) {
      console.error(err);
      toast.error("❌ Error al eliminar tarea");
      fetchTasks();
    } finally {
      setConfirmLoading(false);
    }
  }, [confirmId, fetchTasks]);

  // Open the form for creating a new task (inline)
  const openCreateForm = useCallback(() => {
    setEditingTask(null);
    if (setShowForm) setShowForm(true);
    setShowInlineForm(true);
  }, [setShowForm]);

  // Filtrar y buscar tareas
  const filteredTasks = useMemo(() => tasks.filter(task => {
    const matchesFilter = filter === 'all' ||
      (filter === 'completed' && task.completed) ||
      (filter === 'pending' && !task.completed);

    const matchesSearch = !searchTerm ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  }), [tasks, filter, searchTerm]);

  // Ordenar por proximidad a due_date si se selecciona
  const sortedTasks = useMemo(() => {
    if (sortBy === 'default') {
      // place incomplete tasks first, completed tasks at the end
      return filteredTasks.slice().sort((a, b) => {
        const ac = a.completed ? 1 : 0;
        const bc = b.completed ? 1 : 0;
        return ac - bc; // 0 before 1 -> incomplete before completed
      });
    }
    const withDue = filteredTasks.map(t => {
      if (!t.due_date) return { ...t, dueTs: null };
      const parts = t.due_date.split('-').map(Number);
      const dueTs = new Date(parts[0], parts[1] - 1, parts[2]).getTime();
      return { ...t, dueTs };
    });

    const now = (() => { const dt = new Date(); dt.setHours(0, 0, 0, 0); return dt.getTime(); })();
    if (sortBy === 'due_nearest') {
      return withDue.slice().sort((a, b) => {
        const da = a.dueTs != null ? Math.abs(a.dueTs - now) : Infinity;
        const db = b.dueTs != null ? Math.abs(b.dueTs - now) : Infinity;
        return da - db;
      });
    }
    if (sortBy === 'due_farthest') {
      return withDue.slice().sort((a, b) => {
        const da = a.dueTs != null ? Math.abs(a.dueTs - now) : -Infinity;
        const db = b.dueTs != null ? Math.abs(b.dueTs - now) : -Infinity;
        return db - da;
      });
    }
    return filteredTasks;
  }, [filteredTasks, sortBy]);

  // Estadísticas
  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0
  }), [tasks]);

  if (loading) {
    return (
      <div className={`loading-container ${visible ? 'entering' : 'exiting'}`}>
        <div className="loading-spinner"></div>
        <p>Cargando tus tareas...</p>
      </div>
    );
  }

  return (
    <div className={`task-section ${visible ? 'entering' : 'exiting'}`}>
      {/* Note: header and create button are rendered in Dashboard. This component shows controls, filters and tasks. */}

      {/* Filtros y búsqueda */}
      <div className="task-controls">
        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <div className="search-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>

        {/* The rest of controls (search, filters, sort) are unchanged and follow below */}

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center' }}>
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todas ({stats.total})
            </button>
            <button
              className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pendientes ({stats.pending})
            </button>
            <button
              className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completadas ({stats.completed})
            </button>
          </div>

          <div className="sort-controls">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginRight: '8px' }}>Ordenar:</label>
            <select className="filter-tab" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Por defecto</option>
              <option value="due_nearest">Más cercana (fecha límite)</option>
              <option value="due_farthest">Más lejana (fecha límite)</option>
            </select>
          </div>
        </div>
      </div>
      {/* Show inline TaskForm when requested (from Dashboard button or internal) */}
      {(showForm || showInlineForm) && (
        <TaskForm
          onSaved={() => { if (setShowForm) setShowForm(false); setShowInlineForm(false); fetchTasks(); }}
          editingTask={editingTask}
          onCancel={() => { setEditingTask(null); if (setShowForm) setShowForm(false); setShowInlineForm(false); }}
          showForm={showForm || showInlineForm}
        />
      )}

      {/* Lista de tareas */}
      <div className="task-list-container">
        {sortedTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>No hay tareas</h3>
            <p>
              {searchTerm ? 'No se encontraron tareas con ese término de búsqueda' :
                filter === 'completed' ? 'No tienes tareas completadas aún' :
                  filter === 'pending' ? '¡Excelente! No tienes tareas pendientes' :
                    'Crea tu primera tarea para comenzar'}
            </p>
          </div>
        ) : (
          <div className="task-grid">
            {sortedTasks.map((task, index) => (
              <div key={task.id} className={`task-row animate-fade-in-up ${movingIds.includes(task.id) ? 'moving-out' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
                <TaskCard
                  task={task}
                  onToggleComplete={toggleComplete}
                  onEdit={(t) => { setEditingTask(t); if (setShowForm) setShowForm(true); else setShowInlineForm(true); }}
                  onOpenConfirm={openConfirm}
                  deletingId={deletingId}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Confirm dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer."
        onConfirm={confirmDelete}
        onCancel={() => { setConfirmOpen(false); setConfirmId(null); }}
        loading={confirmLoading}
      />
    </div>
  );
}
