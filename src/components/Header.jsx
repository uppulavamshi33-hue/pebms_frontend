import React from 'react';
import { 
  Wallet, 
  PlusCircle, 
  MinusCircle, 
  Sliders, 
  Download, 
  RefreshCw, 
  Moon, 
  Sun,
  Calendar,
  LogIn,
  LogOut,
  User as UserIcon
} from 'lucide-react';

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

const YEARS = [2024, 2025, 2026, 2027];

export default function Header({
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  onOpenIncomeModal,
  onOpenExpenseModal,
  onOpenBudgetModal,
  onSeedData,
  theme,
  setTheme,
  user,
  onOpenAuthModal,
  onLogout
}) {
  const handleExportCsv = () => {
    window.location.href = `/api/data/export/csv`;
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-icon-wrapper">
          <Wallet size={24} />
        </div>
        <div>
          <div className="brand-title">
            PEBMS <span className="brand-badge">PRO</span>
          </div>
          <div className="brand-tagline">
            Personal Expense & Budget Management System
          </div>
        </div>
      </div>

      <div className="header-controls">
        {/* Period Selector */}
        <div className="period-selector-pill">
          <Calendar size={15} style={{ color: 'var(--accent-indigo)' }} />
          <select 
            className="period-select" 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            aria-label="Select month"
          >
            {MONTHS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <select 
            className="period-select" 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            aria-label="Select year"
          >
            {YEARS.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Quick Actions */}
        <button 
          className="btn btn-income" 
          onClick={onOpenIncomeModal}
          title="Record a new income stream"
        >
          <PlusCircle size={16} />
          <span>Add Income</span>
        </button>

        <button 
          className="btn btn-expense" 
          onClick={onOpenExpenseModal}
          title="Record a new expenditure"
        >
          <MinusCircle size={16} />
          <span>Add Expense</span>
        </button>

        <button 
          className="btn btn-secondary" 
          onClick={onOpenBudgetModal}
          title="Configure category limits"
        >
          <Sliders size={16} />
          <span>Budgets</span>
        </button>

        <button 
          className="btn btn-secondary" 
          onClick={handleExportCsv}
          title="Export transactions to CSV"
        >
          <Download size={16} />
          <span>Export CSV</span>
        </button>

        <button 
          className="btn-icon-only" 
          onClick={onSeedData}
          title="Reload Demo Data"
        >
          <RefreshCw size={17} />
        </button>

        {/* Theme Toggle */}
        <button 
          className="btn-icon-only" 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* User Account / Auth Section */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '6px', borderLeft: '1px solid var(--border-subtle)' }}>
            <div 
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)'
              }}
              title={`${user.name} (${user.email})`}
            >
              {getInitials(user.name)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', marginRight: '4px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                {user.role === 'ROLE_ADMIN' ? 'Admin' : 'Student'}
              </span>
            </div>
            <button 
              className="btn-icon-only" 
              onClick={onLogout}
              title="Sign Out"
              style={{ color: 'var(--accent-rose)' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button 
            className="btn btn-primary" 
            onClick={onOpenAuthModal}
            style={{ paddingLeft: '12px', paddingRight: '14px' }}
          >
            <LogIn size={15} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
