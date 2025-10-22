// src/components/TaskForm.jsx
import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { toast } from "react-toastify";

/*
  Formulario elegante para crear o editar tareas:
  - Diseño moderno con tema dorado, blanco y azul suave
  - Animaciones suaves y efectos visuales
  - Validación en tiempo real
  - Estados de carga con feedback visual
  - Diseño responsivo para móviles
  
  Props:
   - onSaved: función llamada después de crear/editar para refrescar lista
   - editingTask: objeto de tarea a editar (si existe)
   - onCancel: función para cancelar edición
*/
export default function TaskForm({ onSaved, editingTask = null, onCancel, showForm = false }) {
  const [form, setForm] = useState({ title: "", description: "", due_date_display: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editingTask) {
      // editingTask.due_date comes as YYYY-MM-DD -> show as dd/mm/yyyy
      const dDisplay = editingTask.due_date ? (() => {
        const parts = editingTask.due_date.split('-').map(Number);
        if (parts.length === 3) return `${String(parts[2]).padStart(2, '0')}/${String(parts[1]).padStart(2, '0')}/${parts[0]}`;
        return '';
      })() : '';
      setForm({ title: editingTask.title || "", description: editingTask.description || "", due_date_display: dDisplay });
    } else {
      setForm({ title: "", description: "", due_date_display: '' });
    }
    setErrors({});
  }, [editingTask]);

  // Validación en tiempo real
  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) {
      newErrors.title = "El título es obligatorio";
    } else if (form.title.trim().length < 3) {
      newErrors.title = "El título debe tener al menos 3 caracteres";
    }
    if (form.description && form.description.length > 500) {
      newErrors.description = "La descripción no puede exceder 500 caracteres";
    }
    // Validar due_date_display (si existe) -> formato dd/mm/yyyy y no puede ser anterior a hoy
    if (form.due_date_display) {
      const parts = form.due_date_display.split('/').map(Number);
      if (parts.length !== 3) {
        newErrors.due_date = 'La fecha debe tener formato dd/mm/aaaa';
      } else {
        const [d, m, y] = parts;
        const due = new Date(y, m - 1, d);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (isNaN(due.getTime())) {
          newErrors.due_date = 'Fecha inválida';
        } else if (due < today) {
          newErrors.due_date = 'La fecha límite no puede ser anterior a hoy';
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.warn("Por favor, corrige los errores en el formulario");
      return;
    }

    setLoading(true);
    try {
      if (editingTask) {
        // Editar tarea
        // Convert display dd/mm/yyyy to YYYY-MM-DD for API
        let normalized = null;
        if (form.due_date_display) {
          const p = form.due_date_display.split('/').map(Number);
          if (p.length === 3) normalized = `${p[2]}-${String(p[1]).padStart(2, '0')}-${String(p[0]).padStart(2, '0')}`;
        }
        const payload = { title: form.title, description: form.description, due_date: normalized };
        await api.put(`/tasks/${editingTask.id}`, payload);
        toast.success("✅ Tarea actualizada correctamente");
      } else {
        // Crear tarea
        let normalized = null;
        if (form.due_date_display) {
          const p = form.due_date_display.split('/').map(Number);
          if (p.length === 3) normalized = `${p[2]}-${String(p[1]).padStart(2, '0')}-${String(p[0]).padStart(2, '0')}`;
        }
        const payload = { title: form.title, description: form.description, due_date: normalized };
        await api.post("/tasks", payload);
        toast.success("✅ Tarea creada correctamente");
      }
      setForm({ title: "", description: "", due_date_display: '' });
      setErrors({});
      onSaved();
    } catch (err) {
      console.error(err);
      toast.error("❌ Error al guardar la tarea");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${showForm ? 'floating-form-wrapper' : ''}`}>
      <div className={`task-form-container ${editingTask ? 'editing' : ''} ${showForm ? 'floating-card-shadow' : ''}`}>
        <div className="task-form-header">
          <div className="form-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="form-title">
            {editingTask ? "Editar Tarea" : "Nueva Tarea"}
          </h3>
          <p className="form-subtitle">
            {editingTask ? "Modifica los detalles de tu tarea" : "Agrega una nueva tarea a tu lista"}
          </p>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Título de la tarea *
            </label>
            <div className="input-container">
              <input
                id="title"
                type="text"
                placeholder="Escribe un título descriptivo..."
                value={form.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`form-input ${errors.title ? 'error' : ''} ${isFocused ? 'focused' : ''}`}
                disabled={loading}
              />
              <div className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L19.7071 9.70711C19.8946 9.89464 20 10.149 20 10.4142V19C20 20.1046 19.1046 21 18 21H17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Descripción
              <span className="char-count">({form.description.length}/500)</span>
            </label>
            <div className="textarea-container">
              <textarea
                id="description"
                placeholder="Añade una descripción detallada (opcional)..."
                value={form.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                rows="4"
                disabled={loading}
              />
              <div className="textarea-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="due_date" className="form-label">Fecha límite</label>
            <div className="input-container">
              <input
                id="due_date"
                type="text"
                placeholder="dd/mm/aaaa"
                value={form.due_date_display || ''}
                onChange={(e) => handleInputChange('due_date_display', e.target.value)}
                className={`form-input ${errors.due_date ? 'error' : ''}`}
                disabled={loading}
              />
              <div className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                  <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
                  <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
                  <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
            </div>
            {errors.due_date && <span className="error-message">{errors.due_date}</span>}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className={`btn-primary ${loading ? 'loading' : ''}`}
              disabled={loading || !form.title.trim()}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  {editingTask ? "Actualizando..." : "Creando..."}
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {editingTask ? "Actualizar Tarea" : "Crear Tarea"}
                </>
              )}
            </button>

            {editingTask && (
              <button
                type="button"
                className="btn-outline"
                onClick={onCancel}
                disabled={loading}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Cancelar
              </button>
            )}
            {showForm && (
              <button type="button" className="btn-secondary" onClick={onCancel} disabled={loading} style={{ marginLeft: 8 }}>
                Cerrar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
