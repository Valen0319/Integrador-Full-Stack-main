import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import { userModel } from "../models/userModel.js";

// Controlador de registro
export const register = (req, res) => {
  const { name, email, password, role } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ message: "Error al encriptar la contraseña" });
    userModel.createUser(db, { name, email, password: hash, role: role || "user" }, (err) => {
      if (err) return res.status(500).json({ message: "Error al registrar usuario" });
      res.status(201).json({ message: "Usuario registrado con éxito" });
    });
  });
};

// Controlador de login
export const login = (req, res) => {
  const { email, password } = req.body;
  userModel.findByEmail(db, email, (err, data) => {
    if (err || data.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });
    const user = data[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    });
  });
};

// Devuelve información del usuario autenticado (se requiere verifyToken middleware)
export const me = (req, res) => {
  // verifyToken middleware coloca userId y role en req
  const userId = req.userId;
  const sql = "SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1";
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Error al obtener usuario" });
    if (!results || results.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });
    const user = results[0];
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  });
};
