import React, { useEffect, useState, useCallback } from 'react';
import api from '../../api/axiosConfig';
import { toast } from 'react-toastify';
import TaskForm from '../TaskForm';

export default function UserManagementCard() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const fetchUsers = useCallback(async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data || []);
        } catch (err) {
            console.error(err);
            toast.error('No se pudieron cargar los usuarios.');
        }
    }, []);

    const fetchTasks = useCallback(async (userId) => {
        if (!userId) { setTasks([]); return; }
        try {
            const res = await api.get(`/admin/users/${userId}/tasks`);
            setTasks(res.data || []);
        } catch (err) {
            console.error(err);
            toast.error('No se pudieron cargar las tareas del usuario.');
        }
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);
    useEffect(() => { if (selectedUser) fetchTasks(selectedUser.id); else setTasks([]); }, [selectedUser, fetchTasks]);

    const handleSelectUser = (u) => setSelectedUser(u);

    const handleCreateTask = () => { setEditingTask(null); setShowTaskForm(true); };
    const handleEditTask = (t) => { setEditingTask(t); setShowTaskForm(true); };

    const handleDeleteTask = async (taskId) => {
        if (!selectedUser) return;
        try {
            await api.delete(`/tasks/${taskId}`);
            toast.success('Tarea eliminada');
            fetchTasks(selectedUser.id);
        } catch (err) {
            console.error(err);
            toast.error('Error al eliminar tarea');
        }
    };

    const handleTaskSaved = async () => {
        setShowTaskForm(false);
        setEditingTask(null);
        if (selectedUser) fetchTasks(selectedUser.id);
    };

    const handleCreateUser = async () => {
        const name = prompt('Nombre del usuario');
        const email = prompt('Email');
        const password = prompt('Contraseña');
        if (!name || !email || !password) return toast.warn('Campos incompletos');
        try {
            await api.post('/admin/users', { name, email, password });
            toast.success('Usuario creado');
            fetchUsers();
        } catch (err) {
            console.error(err);
            toast.error('Error al crear usuario');
        }
    };

    const handleEditUser = async (u) => {
        const name = prompt('Nombre', u.name) || u.name;
        const email = prompt('Email', u.email) || u.email;
        const role = prompt('Rol (user/admin)', u.role) || u.role;
        try {
            await api.put(`/admin/users/${u.id}`, { name, email, role });
            toast.success('Usuario actualizado');
            fetchUsers();
        } catch (err) {
            console.error(err);
            toast.error('Error al actualizar usuario');
        }
    };

    const handleDeleteUser = async (u) => {
        if (!confirm(`Eliminar usuario ${u.name}?`)) return;
        try {
            await api.delete(`/admin/users/${u.id}`);
            toast.success('Usuario eliminado');
            if (selectedUser?.id === u.id) setSelectedUser(null);
            fetchUsers();
        } catch (err) {
            console.error(err);
            toast.error('Error al eliminar usuario');
        }
    };

    return (
        <div className="user-management-card">
            <div className="user-list">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4>Usuarios</h4>
                    <div>
                        <button className="create-btn" onClick={handleCreateUser}>Crear usuario</button>
                        <button style={{ marginLeft: 8 }} className="view-btn" onClick={fetchUsers}>Refrescar</button>
                    </div>
                </div>

                <ul>
                    {users.map(u => (
                        <li key={u.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <div onClick={() => handleSelectUser(u)} style={{ cursor: 'pointer' }}>
                                <strong>{u.name}</strong> <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{u.email}</div>
                            </div>
                            <div>
                                <button className="edit-btn" onClick={() => handleEditUser(u)}>Editar</button>
                                <button className="delete-btn" onClick={() => handleDeleteUser(u)} style={{ marginLeft: 8 }}>Eliminar</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="user-tasks">
                <h4>Tareas del usuario</h4>
                {selectedUser ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <strong>{selectedUser.name}</strong>
                                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{selectedUser.email}</div>
                            </div>
                            <div>
                                <button className="create-btn" onClick={handleCreateTask}>Crear tarea</button>
                                <button className="view-btn" style={{ marginLeft: 8 }} onClick={() => fetchTasks(selectedUser.id)}>Refrescar</button>
                            </div>
                        </div>

                        <div style={{ marginTop: 12 }}>
                            {tasks.length === 0 && <div>No hay tareas.</div>}
                            {tasks.map(t => (
                                <div key={t.id} className={`task-card ${t.completed ? 'completed' : ''}`} style={{ marginBottom: 12 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <div className="task-title">{t.title}</div>
                                            <div className="task-description">{t.description}</div>
                                        </div>
                                        <div>
                                            <button className="edit-btn" onClick={() => handleEditTask(t)}>Editar</button>
                                            <button className="delete-btn" onClick={() => handleDeleteTask(t.id)} style={{ marginLeft: 8 }}>Eliminar</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </>
                ) : (
                    <div>Selecciona un usuario para ver y gestionar sus tareas.</div>
                )}
            </div>

            {showTaskForm && (
                <TaskForm
                    showForm={showTaskForm}
                    editingTask={editingTask}
                    onSaved={handleTaskSaved}
                    onCancel={() => { setShowTaskForm(false); setEditingTask(null); }}
                />
            )}
        </div>
    );
}
