// src/pages/AdminPanel.jsx
import React from "react";
import AdminInfoCard from "../components/admin/AdminInfoCard";
import UserManagementCard from "../components/admin/UserManagementCard";

export default function AdminPanel() {
  return (
    <div className="page admin-panel">
      <h2>Panel de Administración</h2>
      <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20, marginTop: 20 }}>
        <AdminInfoCard />
        <UserManagementCard />
      </div>
    </div>
  );
}
