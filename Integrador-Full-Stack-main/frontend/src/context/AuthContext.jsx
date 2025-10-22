// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { getUserFromToken, logout as utilLogout } from "../utils/auth";
import api from "../api/axiosConfig";

export const AuthContext = createContext();

/*
  Provee el estado de autenticación a la app.
  Almacena 'user' (objeto decodificado del JWT) y setUser.
*/
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On mount, try to restore session by validating token with backend
  useEffect(() => {
    let mounted = true;

    const restore = async () => {
      const localUser = getUserFromToken();
      if (!localUser) {
        setUser(null);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (!mounted) return;
        setUser(res.data);
      } catch (err) {
        // token invalid or expired -> clear and redirect to login
        localStorage.removeItem('token');
        setUser(null);
        // direct navigation to login; the app router will show the login page
        window.location.href = '/login';
      }
    };

    restore();

    // If token changes in other tab, sync
    const onStorage = () => setUser(getUserFromToken());
    window.addEventListener("storage", onStorage);

    return () => { mounted = false; window.removeEventListener("storage", onStorage); };
  }, []);

  const logout = () => {
    utilLogout();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>;
};
