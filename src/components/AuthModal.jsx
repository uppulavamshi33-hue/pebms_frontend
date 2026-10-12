import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Sparkles, LogIn, UserPlus } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegister && !name.trim()) {
      setError('Name is required');
      return;
    }
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      if (isRegister) {
        await onAuthSuccess('register', { name: name.trim(), email: email.trim(), password });
      } else {
        await onAuthSuccess('login', { email: email.trim(), password });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await onAuthSuccess('demo');
      onClose();
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={18} style={{ color: 'var(--accent-indigo)' }} />
            <span>{isRegister ? 'Join PEBMS' : 'Sign In to PEBMS'}</span>
          </h3>
          <button className="btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }}>
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(''); }}
            style={{
              flex: 1,
              padding: '12px',
              fontWeight: '600',
              fontSize: '13px',
              borderBottom: !isRegister ? '2px solid var(--accent-indigo)' : 'none',
              color: !isRegister ? 'var(--text-main)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <LogIn size={15} />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(''); }}
            style={{
              flex: 1,
              padding: '12px',
              fontWeight: '600',
              fontSize: '13px',
              borderBottom: isRegister ? '2px solid var(--accent-indigo)' : 'none',
              color: isRegister ? 'var(--text-main)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <UserPlus size={15} />
            <span>Register</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{
                color: 'var(--accent-rose)',
                fontSize: '13px',
                background: 'var(--accent-rose-glow)',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(244, 63, 94, 0.3)'
              }}>
                {error}
              </div>
            )}

            {isRegister && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Vamshi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', paddingLeft: '34px' }}
                  />
                  <UserIcon size={15} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-subtle)' }} />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', paddingLeft: '34px' }}
                  autoFocus
                />
                <Mail size={15} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-subtle)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', paddingLeft: '34px' }}
                />
                <Lock size={15} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-subtle)' }} />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '6px', padding: '11px' }}
            >
              {loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Sign In')}
            </button>

            {/* Quick Demo Access Button */}
            {!isRegister && (
              <div style={{ marginTop: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginBottom: '8px' }}>
                  OR EXPLORE WITH ONE CLICK
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  style={{
                    width: '100%',
                    borderColor: 'var(--border-focus)',
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Sparkles size={16} style={{ color: 'var(--accent-indigo)' }} />
                  <span>Instant Student Demo Login</span>
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
