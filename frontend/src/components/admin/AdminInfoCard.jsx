import React from 'react';

export default function AdminInfoCard() {
    return (
        <div className="admin-info-card">
            <h3>Panel de Administrador</h3>
            <p>Desde aquí puedes:
                <ul>
                    <li>Ver todos los usuarios registrados</li>
                    <li>Crear tareas para cualquier usuario</li>
                    <li>Crear, editar o eliminar usuarios</li>
                    <li>Ver y gestionar las tareas de un usuario seleccionado</li>
                </ul>
            </p>
        </div>
    );
}
