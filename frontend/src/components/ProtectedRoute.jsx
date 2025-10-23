// src/components/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/*
  Componente que protege rutas.
  Props:
   - children: componente a renderizar si pasa la validación
   - requireAdmin: si true, solo usuarios con role === "admin" pueden entrar
*/
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    // No autenticado -> ir a login
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== "admin") {
    // Autenticado pero no admin -> redirigir al dashboard
    return <Navigate to="/" replace />;
  }

  return children;
}
