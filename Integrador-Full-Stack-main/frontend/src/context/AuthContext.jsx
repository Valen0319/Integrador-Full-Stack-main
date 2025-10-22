// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { getUserFromToken } from "../utils/auth";

export const AuthContext = createContext();

/*
  Provee el estado de autenticación a la app.
  Almacena 'user' (objeto decodificado del JWT) y setUser.
*/
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getUserFromToken());

  // Si cambia el token en otra pestaña, sincronizar usuario
  useEffect(() => {
    const onStorage = () => setUser(getUserFromToken());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};
