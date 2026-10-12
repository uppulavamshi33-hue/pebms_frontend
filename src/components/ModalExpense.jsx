import React, { useState, useEffect } from 'react';
import { X, MinusCircle } from 'lucide-react';

const EXPENSE_CATEGORIES = [
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
  'Debt / Loans',
  'Miscellaneous'
];

const PAYMENT_METHODS = [
  'Credit Card',
  'Debit Card',
  'UPI',
  'Cash',
  'Net Banking',
  'Other'
];

export default function ModalExpense({ isOpen, onClose, onSave, editingExpense }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title || '');
      setAmount(editingExpense.amount ? String(editingExpense.amount) : '');
      setCategory(editingExpense.category || 'Food & Dining');
      setDate(editingExpense.date || new Date().toISOString().split('T')[0]);
      setPaymentMethod(editingExpense.paymentMethod || 'Credit Card');
      setNotes(editingExpense.notes || '');
    } else {
      setTitle('');
      setAmount('');
      setCategory('Food & Dining');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('Credit Card');
      setNotes('');
    }
    setError('');
  }, [editingExpense, isOpen]);

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
      id: editingExpense?.id,
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
            <MinusCircle size={20} style={{ color: 'var(--accent-rose)' }} />
            <span>{editingExpense ? 'Edit Expense' : 'Record New Expense'}</span>
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
              <label className="form-label">Expense Description</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Grocery Supermarket, Electric Power Bill, Flight Ticket"
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
                  {EXPENSE_CATEGORIES.map(c => (
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
                placeholder="Receipt info, merchant details, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-expense">
              {editingExpense ? 'Save Changes' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
