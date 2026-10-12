import React from 'react';
import { Target, Plus, AlertCircle, CheckCircle2, AlertTriangle, Trash2, Edit3 } from 'lucide-react';

export default function BudgetTracker({
  budgetStatuses = [],
  onOpenBudgetModal,
  onDeleteBudget,
  selectedMonthName,
  selectedYear
}) {
  return (
    <div className="card-panel">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">
            <Target size={20} style={{ color: 'var(--accent-amber)' }} />
            <span>Monthly Budget Control ({selectedMonthName} {selectedYear})</span>
          </h2>
          <p className="panel-subtitle">
            Category thresholds with real-time warning indicators
          </p>
        </div>

        <button 
          className="btn btn-secondary" 
          onClick={() => onOpenBudgetModal()}
          style={{ fontSize: '12px', padding: '6px 12px' }}
        >
          <Plus size={15} />
          <span>New Budget</span>
        </button>
      </div>

      {budgetStatuses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-subtle)', fontSize: '13px' }}>
          No budgets configured for this month. Click <strong>New Budget</strong> to set category limits.
        </div>
      ) : (
        <div className="budget-grid">
          {budgetStatuses.map((b) => {
            const pct = b.percentageUsed || 0;
            const isExceeded = b.status === 'EXCEEDED';
            const isWarning = b.status === 'WARNING';

            let barColor = 'var(--accent-emerald)';
            if (isExceeded) barColor = 'var(--accent-rose)';
            else if (isWarning) barColor = 'var(--accent-amber)';

            return (
              <div key={b.id || b.category} className="budget-card">
                <div className="budget-card-top">
                  <div className="budget-category-title">
                    {b.category}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`status-badge status-${b.status}`}>
                      {isExceeded ? 'EXCEEDED' : isWarning ? 'WARNING 80%+' : 'ON TRACK'}
                    </span>
                    {onOpenBudgetModal && (
                      <button 
                        className="btn-row-action" 
                        onClick={() => onOpenBudgetModal(b)}
                        title="Edit Budget"
                        style={{ padding: '2px' }}
                      >
                        <Edit3 size={13} />
                      </button>
                    )}
                    {onDeleteBudget && b.id && (
                      <button 
                        className="btn-row-action delete" 
                        onClick={() => onDeleteBudget(b.id)}
                        title="Delete Budget"
                        style={{ padding: '2px' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="budget-numbers-row">
                  <span>Spent: <strong>${Number(b.actualSpent).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
                  <span>Limit: <strong>${Number(b.monthlyLimit).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
                </div>

                <div className="progress-bar-bg" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${Math.min(100, pct)}%`, 
                      backgroundColor: barColor 
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>
                    {pct}% utilized
                  </span>
                  <span style={{ 
                    fontWeight: '600', 
                    color: isExceeded ? 'var(--accent-rose)' : 'var(--text-muted)' 
                  }}>
                    {isExceeded 
                      ? `$${Math.abs(b.remainingAmount).toFixed(2)} over` 
                      : `$${b.remainingAmount.toFixed(2)} left`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
