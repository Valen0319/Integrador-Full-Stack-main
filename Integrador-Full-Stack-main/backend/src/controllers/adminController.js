import { db } from "../config/db.js";
import bcrypt from "bcryptjs";

// List all users (admin only)
export const listUsers = (req, res) => {
    db.query("SELECT id, name, email, role FROM users", (err, results) => {
        if (err) return res.status(500).json({ message: "Error al listar usuarios" });
        res.json(results);
    });
};

// Create a user (admin only)
export const createUser = (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Faltan campos requeridos' });
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ message: 'Error al encriptar contraseña' });
        const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
        db.query(sql, [name, email, hash, role || 'user'], (err, result) => {
            if (err) return res.status(500).json({ message: 'Error al crear usuario' });
            res.status(201).json({ id: result.insertId, name, email, role: role || 'user' });
        });
    });
};

// Update a user (admin only)
export const updateUser = (req, res) => {
    const { id } = req.params;
    const { name, email, role, password } = req.body;
    const updates = [];
    const params = [];
    if (name) { updates.push('name = ?'); params.push(name); }
    if (email) { updates.push('email = ?'); params.push(email); }
    if (role) { updates.push('role = ?'); params.push(role); }

    const finishUpdate = (finalParams) => {
        if (updates.length === 0 && !password) return res.status(400).json({ message: 'No hay campos para actualizar' });
        const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
        db.query(sql, [...finalParams, id], (err, result) => {
            if (err) return res.status(500).json({ message: 'Error al actualizar usuario' });
            res.json({ message: 'Usuario actualizado correctamente' });
        });
    };

    if (password) {
        // hash password then update
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).json({ message: 'Error al encriptar contraseña' });
            updates.push('password = ?');
            params.push(hash);
            finishUpdate(params);
        });
    } else {
        finishUpdate(params);
    }
};

// Delete a user (admin only)
export const deleteUser = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error al eliminar usuario' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json({ message: 'Usuario eliminado correctamente' });
    });
};

// List tasks for a given user (admin only)
export const listUserTasks = (req, res) => {
    const { id } = req.params;
    const sql = `SELECT t.id, t.title, t.description, DATE_FORMAT(t.due_date, '%Y-%m-%d') as due_date, t.completed FROM tasks t WHERE t.user_id = ? ORDER BY t.due_date IS NULL, t.due_date ASC`;
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error al obtener tareas del usuario' });
        res.json(results);
    });
};

// Create a task for a user (admin only)
export const createUserTask = (req, res) => {
    const { id } = req.params; // user id
    const { title, description, due_date } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const sql = 'INSERT INTO tasks (user_id, title, description, due_date) VALUES (?, ?, ?, ?)';
    db.query(sql, [id, title, description || null, due_date || null], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error al crear tarea' });
        res.status(201).json({ id: result.insertId, message: 'Tarea creada' });
    });
};
