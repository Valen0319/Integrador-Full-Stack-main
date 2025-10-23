// src/utils/auth.js
import { jwtDecode } from "jwt-decode";

/*
  Funciones pequeñas para tratar el token:
  - getToken: obtiene token del localStorage
  - getUserFromToken: decodifica y retorna datos del usuario
  - logout: borra token y refresca la página (o redirige)
*/

export const getToken = () => localStorage.getItem("token");

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded; // contiene al menos { id, role, iat, exp } si es el payload que creaste en backend
  } catch (e) {
    console.error("Token inválido:", e);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export default { getToken, getUserFromToken, logout };