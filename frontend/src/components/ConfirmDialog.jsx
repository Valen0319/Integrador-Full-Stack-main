import React from 'react';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading }) {
    if (!open) return null;

    return (
        <div className="confirm-overlay">
            <div className="confirm-modal">
                <h3 className="confirm-title">{title}</h3>
                <p className="confirm-message">{message}</p>

                <div className="confirm-actions">
                    <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancelar</button>
                    <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
                        {loading ? <div className="loading-spinner small"></div> : 'Eliminar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
