export const taskModel = {
  createTask: (db, data, callback) => {
    const sql = "INSERT INTO tasks (title, description, due_date, user_id) VALUES (?, ?, ?, ?)";
    db.query(sql, [data.title, data.description || null, data.due_date || null, data.user_id], callback);
  },

  getTasksByUser: (db, user_id, callback) => {
    // Return due_date formatted as YYYY-MM-DD so frontend receives a date-only string
    const sql = `SELECT id, title, description, DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date, completed, user_id, created_at, updated_at
                 FROM tasks WHERE user_id = ?`;
    db.query(sql, [user_id], callback);
  },

  updateTask: (db, id, user_id, data, callback) => {
    // Only allow updating a task if it belongs to the user (user_id)
    const sql = "UPDATE tasks SET title=?, description=?, due_date=?, completed=? WHERE id=? AND user_id=?";
    const completedVal = data.completed ? 1 : 0;
    db.query(sql, [data.title, data.description || null, data.due_date || null, completedVal, id, user_id], callback);
  },

  deleteTask: (db, id, user_id, callback) => {
    // Only delete when the task belongs to the user
    db.query("DELETE FROM tasks WHERE id=? AND user_id=?", [id, user_id], callback);
  },
};
