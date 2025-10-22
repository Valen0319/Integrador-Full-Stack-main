import React from 'react';
import { FiEdit } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';

function TaskCard({ task, onToggleComplete, onEdit, onOpenConfirm, deletingId }) {
    return (
        <div className={`task-card ${task.completed ? 'completed' : ''}`}>
            <div className="task-card-header">
                <div className="task-checkbox">
                    <input
                        type="checkbox"
                        id={`task-${task.id}`}
                        checked={!!task.completed}
                        onChange={() => onToggleComplete(task)}
                        className="checkbox-input"
                    />
                    <label htmlFor={`task-${task.id}`} className="checkbox-label">
                        <div className="checkbox-custom">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </label>
                </div>

                <div className="task-actions">
                    <button
                        className="action-btn edit-btn"
                        onClick={() => onEdit(task)}
                        title="Editar tarea"
                    >
                        <FiEdit className="icon" />
                    </button>

                    <button
                        className="action-btn delete-btn"
                        onClick={() => onOpenConfirm(task.id)}
                        disabled={deletingId === task.id}
                        title="Eliminar tarea"
                    >
                        {deletingId === task.id ? (
                            <div className="loading-spinner small"></div>
                        ) : (
                            <MdDelete className="icon" />
                        )}
                    </button>
                </div>
            </div>

            <div className="task-content">
                <h4 className="task-title">{task.title}</h4>
                {task.description && (
                    <p className="task-description">{task.description}</p>
                )}
            </div>

            <div className="task-footer">
                <div className="task-status">
                    <span className={`status-badge ${task.completed ? 'completed' : 'pending'}`}>
                        {task.completed ? 'Completada' : 'Pendiente'}
                    </span>
                </div>
                <div className="task-date">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
                        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
                        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span>
                        {task.due_date ? (() => {
                            // due_date comes as 'YYYY-MM-DD' -> format as 'dd/mm/aaaa' safely (no timezone shift)
                            const parts = task.due_date.split('-').map(Number);
                            if (parts.length === 3) {
                                const [y, m, d] = parts;
                                const dd = String(d).padStart(2, '0');
                                const mm = String(m).padStart(2, '0');
                                return `${dd}/${mm}/${y}`;
                            }
                            // Fallback
                            try {
                                return new Date(task.due_date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
                            } catch {
                                return String(task.due_date);
                            }
                        })() : (() => {
                            const source = task.createdAt || task.updatedAt;
                            if (!source) return '';
                            try {
                                return new Date(source).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
                            } catch {
                                return String(source);
                            }
                        })()}
                    </span>
                    {task.due_date && (() => {
                        const [y, m, d] = task.due_date.split('-').map(Number);
                        const dueDate = new Date(y, m - 1, d);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return (dueDate < today && !task.completed) ? <span className="overdue-badge">Vencida</span> : null;
                    })()}
                </div>
            </div>
        </div>
    );
}

export default React.memo(TaskCard);
