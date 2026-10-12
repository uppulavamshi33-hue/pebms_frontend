import React, { useState, useEffect } from 'react';
import { X, Sliders } from 'lucide-react';

const BUDGET_CATEGORIES = [
  'OVERALL',
  'Food & Dining',
  'Housing',
  'Utilities',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Education',
  'Travel',
  'Personal Care',
  'Miscellaneous'
];

export default function ModalBudget({
  isOpen,
  onClose,
  onSave,
  selectedMonth,
  selectedYear,
  editingBudget
}) {
  const [category, setCategory] = useState('OVERALL');
  const [month, setMonth] = useState(selectedMonth || new Date().getMonth() + 1);
  const [year, setYear] = useState(selectedYear || new Date().getFullYear());
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editingBudget) {
        setCategory(editingBudget.category || 'OVERALL');
        setMonth(editingBudget.month || selectedMonth);
        setYear(editingBudget.year || selectedYear);
        setMonthlyLimit(editingBudget.monthlyLimit ? String(editingBudget.monthlyLimit) : '');
        setNotes(editingBudget.notes || '');
      } else {
        setCategory('OVERALL');
        setMonth(selectedMonth || new Date().getMonth() + 1);
        setYear(selectedYear || new Date().getFullYear());
        setMonthlyLimit('');
        setNotes('');
      }
      setError('');
    }
  }, [isOpen, selectedMonth, selectedYear, editingBudget]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const limit = parseFloat(monthlyLimit);
    if (isNaN(limit) || limit <= 0) {
      setError('Please enter a valid budget limit greater than zero');
      return;
    }

    onSave({
      category,
      month: Number(month),
      year: Number(year),
      monthlyLimit: limit,
      notes: notes.trim()
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={20} style={{ color: 'var(--accent-indigo)' }} />
            <span>Configure Monthly Budget</span>
          </h3>
          <button className="btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{ color: 'var(--accent-rose)', fontSize: '13px', background: 'var(--accent-rose-glow)', padding: '8px 12px', borderRadius: '6px' }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {BUDGET_CATEGORIES.map(c => (
                  <option key={c} value={c}>
                    {c === 'OVERALL' ? '★ OVERALL (Total Monthly Ceiling)' : c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Month</label>
                <select 
                  className="form-select"
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                >
                  {[
                    { v: 1, n: 'Jan' }, { v: 2, n: 'Feb' }, { v: 3, n: 'Mar' },
                    { v: 4, n: 'Apr' }, { v: 5, n: 'May' }, { v: 6, n: 'Jun' },
                    { v: 7, n: 'Jul' }, { v: 8, n: 'Aug' }, { v: 9, n: 'Sep' },
                    { v: 10, n: 'Oct' }, { v: 11, n: 'Nov' }, { v: 12, n: 'Dec' },
                  ].map(m => (
                    <option key={m.v} value={m.v}>{m.n}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Year</label>
                <input 
                  type="number"
                  className="form-input"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Monthly Limit Allowance ($)</label>
              <input 
                type="number" 
                step="1"
                min="1"
                className="form-input" 
                placeholder="e.g. 500, 1500, 3500"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notes (Optional)</label>
              <textarea 
                className="form-textarea" 
                rows="2"
                placeholder="Target limits, guidelines, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Set Budget Limit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
