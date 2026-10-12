import React, { useState } from 'react';
import { 
  ReceiptText, 
  Search, 
  Edit3, 
  Trash2,
  Calendar,
  CreditCard
} from 'lucide-react';

export default function TransactionLedger({
  transactions = [],
  onEditTransaction,
  onDeleteTransaction,
  categories = []
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Filter transactions
  const filtered = transactions.filter((tx) => {
    const matchesType = typeFilter === 'ALL' || tx.type === typeFilter;
    const matchesCategory = categoryFilter === 'ALL' || tx.category?.toLowerCase() === categoryFilter.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesQuery = !query || 
      tx.title?.toLowerCase().includes(query) ||
      tx.category?.toLowerCase().includes(query) ||
      tx.notes?.toLowerCase().includes(query) ||
      tx.paymentMethod?.toLowerCase().includes(query);

    return matchesType && matchesCategory && matchesQuery;
  });

  return (
    <div className="card-panel">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">
            <ReceiptText size={20} style={{ color: 'var(--accent-indigo)' }} />
            <span>Transaction Ledger & History</span>
          </h2>
          <p className="panel-subtitle">
            Chronological records of all incoming and outgoing cashflows
          </p>
        </div>
      </div>

      <div className="ledger-controls">
        <div className="search-filter-box">
          <Search size={16} style={{ color: 'var(--text-subtle)' }} />
          <input 
            type="text" 
            placeholder="Search by description, notes, method..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Type Filter */}
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${typeFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setTypeFilter('ALL')}
            >
              All
            </button>
            <button 
              className={`filter-tab ${typeFilter === 'INCOME' ? 'active' : ''}`}
              onClick={() => setTypeFilter('INCOME')}
              style={typeFilter === 'INCOME' ? { background: 'var(--accent-emerald)' } : {}}
            >
              Income
            </button>
            <button 
              className={`filter-tab ${typeFilter === 'EXPENSE' ? 'active' : ''}`}
              onClick={() => setTypeFilter('EXPENSE')}
              style={typeFilter === 'EXPENSE' ? { background: 'var(--accent-rose)' } : {}}
            >
              Expenses
            </button>
          </div>

          {/* Category Dropdown */}
          <select 
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ padding: '7px 12px', fontSize: '12px' }}
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-subtle)', fontSize: '13px' }}>
          No transactions found matching the filter criteria.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Payment Method</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => {
                const isIncome = tx.type === 'INCOME';
                return (
                  <tr key={`${tx.type}-${tx.id}`}>
                    <td>
                      <span className={`tx-type-pill ${tx.type}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <Calendar size={13} style={{ color: 'var(--text-subtle)' }} />
                        {tx.date}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                        {tx.title}
                      </div>
                      {tx.notes && (
                        <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '2px' }}>
                          {tx.notes}
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ 
                        background: 'var(--border-subtle)', 
                        padding: '3px 8px', 
                        borderRadius: 'var(--radius-full)', 
                        fontSize: '11px',
                        fontWeight: '500'
                      }}>
                        {tx.category}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                      {tx.paymentMethod ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <CreditCard size={13} style={{ color: 'var(--text-subtle)' }} />
                          {tx.paymentMethod}
                        </span>
                      ) : '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={`amount-display ${isIncome ? 'income' : 'expense'}`}>
                        {isIncome ? '+' : '-'}${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="tx-actions" style={{ justifyContent: 'center' }}>
                        <button 
                          className="btn-row-action" 
                          onClick={() => onEditTransaction(tx)}
                          title="Edit transaction"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button 
                          className="btn-row-action delete" 
                          onClick={() => onDeleteTransaction(tx)}
                          title="Delete transaction"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
