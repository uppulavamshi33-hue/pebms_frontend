import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} />,
    error: <AlertCircle size={18} style={{ color: 'var(--accent-rose)' }} />,
    info: <Info size={18} style={{ color: 'var(--accent-indigo)' }} />
  };

  return (
    <div className="toast-container" onClick={onClose} style={{ cursor: 'pointer' }}>
      <div className={`toast ${toast.type || 'info'}`}>
        {icons[toast.type || 'info']}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
