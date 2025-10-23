// Modelo SQL de usuario
export const userModel = {
  createUser: (db, userData, callback) => {
    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(sql, [userData.name, userData.email, userData.password, userData.role], callback);
  },

  findByEmail: (db, email, callback) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], callback);
  },
};
