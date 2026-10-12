import React, { useState } from 'react';
import { PieChart } from 'lucide-react';

const CATEGORY_COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', 
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#64748b'
];

export default function CategoryDistribution({ 
  expenseBreakdown = [], 
  incomeBreakdown = [],
  selectedMonthName,
  selectedYear
}) {
  const [activeTab, setActiveTab] = useState('EXPENSE');

  const currentList = activeTab === 'EXPENSE' ? expenseBreakdown : incomeBreakdown;
  const totalAmount = currentList.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  return (
    <div className="card-panel">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">
            <PieChart size={20} style={{ color: activeTab === 'EXPENSE' ? 'var(--accent-rose)' : 'var(--accent-emerald)' }} />
            <span>Category Breakdown</span>
          </h2>
          <p className="panel-subtitle">
            {selectedMonthName} {selectedYear} distribution
          </p>
        </div>

        <div className="filter-tabs">
          <button 
            className={`filter-tab ${activeTab === 'EXPENSE' ? 'active' : ''}`}
            onClick={() => setActiveTab('EXPENSE')}
            style={activeTab === 'EXPENSE' ? { background: 'var(--accent-rose)' } : {}}
          >
            Expenses
          </button>
          <button 
            className={`filter-tab ${activeTab === 'INCOME' ? 'active' : ''}`}
            onClick={() => setActiveTab('INCOME')}
            style={activeTab === 'INCOME' ? { background: 'var(--accent-emerald)' } : {}}
          >
            Income
          </button>
        </div>
      </div>

      {currentList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-subtle)', fontSize: '13px' }}>
          No {activeTab.toLowerCase()} records for this period.
        </div>
      ) : (
        <div className="category-list">
          {currentList.map((cat, idx) => {
            const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
            const pct = cat.percentage || 0;

            return (
              <div key={cat.category || idx} className="category-item">
                <div className="category-item-top">
                  <div className="category-name-group">
                    <span 
                      className="category-color-dot" 
                      style={{ backgroundColor: color }}
                    />
                    <span>{cat.category}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 'normal' }}>
                      ({cat.transactionCount} {cat.transactionCount === 1 ? 'tx' : 'txs'})
                    </span>
                  </div>

                  <div className="category-amount-group">
                    <span className="category-amount">
                      ${Number(cat.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span className="category-percentage">
                      {pct}%
                    </span>
                  </div>
                </div>

                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${Math.min(100, pct)}%`, 
                      backgroundColor: color 
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
