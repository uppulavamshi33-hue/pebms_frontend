import React, { useState, useEffect } from 'react';
import { X, PlusCircle } from 'lucide-react';

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Business',
  'Rental',
  'Bonus',
  'Gifts',
  'Side Hustle',
  'Other'
];

const PAYMENT_METHODS = [
  'Bank Transfer',
  'UPI',
  'Cash',
  'Cheque',
  'PayPal / Stripe',
  'Other'
];

export default function ModalIncome({ isOpen, onClose, onSave, editingIncome }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Salary');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingIncome) {
      setTitle(editingIncome.title || '');
      setAmount(editingIncome.amount ? String(editingIncome.amount) : '');
      setCategory(editingIncome.category || 'Salary');
      setDate(editingIncome.date || new Date().toISOString().split('T')[0]);
      setPaymentMethod(editingIncome.paymentMethod || 'Bank Transfer');
      setNotes(editingIncome.notes || '');
    } else {
      setTitle('');
      setAmount('');
      setCategory('Salary');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('Bank Transfer');
      setNotes('');
    }
    setError('');
  }, [editingIncome, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid positive amount');
      return;
    }
    if (!date) {
      setError('Date is required');
      return;
    }

    onSave({
      id: editingIncome?.id,
      title: title.trim(),
      amount: numAmount,
      category,
      date,
      paymentMethod,
      notes: notes.trim()
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={20} style={{ color: 'var(--accent-emerald)' }} />
            <span>{editingIncome ? 'Edit Income' : 'Record New Income'}</span>
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
              <label className="form-label">Income Title / Source</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Monthly Salary, Freelance Web App, Dividend"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Amount ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0.01"
                  className="form-input" 
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select 
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {INCOME_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select 
                  className="form-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  {PAYMENT_METHODS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes (Optional)</label>
              <textarea 
                className="form-textarea" 
                rows="2"
                placeholder="Additional details, invoice number, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-income">
              {editingIncome ? 'Save Changes' : 'Save Income'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
