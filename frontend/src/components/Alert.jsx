import { AlertCircle, CheckCircle, X } from 'lucide-react';

const Alert = ({ type = 'info', message, onClose, style }) => {
  const isError = type === 'error';
  
  const baseStyle = {
    padding: '1rem',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    background: isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
    border: `1px solid ${isError ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
    color: isError ? 'var(--danger)' : 'var(--success)',
    ...style
  };

  return (
    <div style={baseStyle}>
      {isError ? <AlertCircle size={20} style={{ flexShrink: 0 }} /> : <CheckCircle size={20} style={{ flexShrink: 0 }} />}
      <div style={{ flex: 1, fontSize: '0.9rem', lineHeight: '1.4' }}>
        {message}
      </div>
      {onClose && (
        <button 
          onClick={onClose} 
          style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '0.2rem' }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
