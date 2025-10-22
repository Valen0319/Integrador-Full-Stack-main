import { db } from "../config/db.js";
import { taskModel } from "../models/taskModel.js";

export const createTask = (req, res) => {
  const { title, description, due_date } = req.body;
  const user_id = req.user.id;
  // Validate title
  if (!title || title.trim().length === 0) return res.status(400).json({ message: 'Title is required' });

  // Validate due_date (if provided) -> must be YYYY-MM-DD and not before today
  let normalizedDate = null;
  if (due_date) {
    const dateMatch = /^\d{4}-\d{2}-\d{2}$/.test(due_date);
    if (!dateMatch) return res.status(400).json({ message: 'due_date must be YYYY-MM-DD' });
    const d = new Date(due_date + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(d.getTime())) return res.status(400).json({ message: 'Invalid due_date' });
    if (d < today) return res.status(400).json({ message: 'due_date cannot be in the past' });
    normalizedDate = due_date;
  }

  taskModel.createTask(db, { title: title.trim(), description: description || null, due_date: normalizedDate, user_id }, (err, result) => {
    if (err) return res.status(500).json({ message: "Error al crear tarea" });
    // Return created task id to client
    res.status(201).json({ message: "Tarea creada correctamente", id: result.insertId });
  });
};

export const getTasks = (req, res) => {
  const user_id = req.user.id;
  taskModel.getTasksByUser(db, user_id, (err, data) => {
    if (err) return res.status(500).json({ message: "Error al obtener tareas" });
    res.json(data);
  });
};

export const updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, completed, due_date } = req.body;
  const user_id = req.user.id;

  // Basic validation
  if (title && title.trim().length === 0) return res.status(400).json({ message: 'Title cannot be empty' });

  // Normalize completed to boolean
  const completedBool = completed === true || completed === 1 || completed === '1' || completed === 'true';

  // Validate due_date if provided
  let normalizedDate = null;
  if (due_date !== undefined && due_date !== null && due_date !== '') {
    const dateMatch = /^\d{4}-\d{2}-\d{2}$/.test(due_date);
    if (!dateMatch) return res.status(400).json({ message: 'due_date must be YYYY-MM-DD' });
    const d = new Date(due_date + 'T00:00:00');
    if (isNaN(d.getTime())) return res.status(400).json({ message: 'Invalid due_date' });
    normalizedDate = due_date;
  }

  taskModel.updateTask(db, id, user_id, { title: title ? title.trim() : null, description: description || null, due_date: normalizedDate, completed: completedBool }, (err, result) => {
    if (err) return res.status(500).json({ message: "Error al actualizar tarea" });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Tarea no encontrada o no tienes permiso' });
    res.json({ message: "Tarea actualizada correctamente" });
  });
};

export const deleteTask = (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  taskModel.deleteTask(db, id, user_id, (err, result) => {
    if (err) return res.status(500).json({ message: "Error al eliminar tarea" });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Tarea no encontrada o no tienes permiso' });
    res.json({ message: "Tarea eliminada correctamente" });
  });
};
