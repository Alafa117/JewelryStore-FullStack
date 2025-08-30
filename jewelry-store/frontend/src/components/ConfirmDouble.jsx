// frontend/src/components/ConfirmDouble.jsx
import React, { useState } from 'react'
import '../styles/components/forms.css'

/**
 * ConfirmDouble: modal de confirmación con input para escribir una palabra (ej. "ELIMINAR")
 * Props:
 * - title, prompt, confirmText (string that user must type), onCancel, onConfirm
 */
export default function ConfirmDouble({ title = 'Confirmar', prompt = '', confirmText = 'ELIMINAR', onCancel, onConfirm }) {
    const [value, setValue] = useState('')

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={(e) => { if (e.target.classList.contains('modal-overlay')) onCancel && onCancel() }}>
            <div className="modal-card" style={{ maxWidth: 520 }}>
                <header className="modal-header">
                    <h3>{title}</h3>
                    <button className="icon-btn" onClick={() => onCancel && onCancel()}>Cerrar</button>
                </header>

                <div className="modal-body">
                    <p style={{ color: 'var(--muted)' }}>{prompt}</p>

                    <div style={{ marginTop: 12 }}>
                        <label style={{ display: 'block', marginBottom: 8 }}>
                            Escribe <strong>{confirmText}</strong> para confirmar:
                        </label>
                        <input value={value} onChange={(e) => setValue(e.target.value)} placeholder={confirmText} style={{ padding: 8, width: '100%', borderRadius: 8, border: '1px solid rgba(11,11,11,0.06)' }} />
                    </div>

                    <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                        <button className="icon-btn small" onClick={() => onCancel && onCancel()}>Cancelar</button>
                        <button
                            className="form-btn"
                            onClick={() => onConfirm && onConfirm()}
                            disabled={value.trim().toUpperCase() !== confirmText.toUpperCase()}
                            title={value.trim().toUpperCase() === confirmText.toUpperCase() ? 'Eliminar' : `Escribe ${confirmText} para habilitar`}
                        >
                            Eliminar definitivamente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
