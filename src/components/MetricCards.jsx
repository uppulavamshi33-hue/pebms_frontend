import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function MetricCards({ dashboard }) {
  if (!dashboard) return null;

  const income = dashboard.selectedMonthIncome || 0;
  const expense = dashboard.selectedMonthExpense || 0;
  const savings = dashboard.selectedMonthSavings || 0;
  const savingsRate = dashboard.selectedMonthSavingsRate || 0;
  const lifetimeBalance = dashboard.lifetimeBalance || 0;

  // Find OVERALL budget or aggregate category limits
  const overallBudget = dashboard.budgetStatuses?.find(b => b.category === 'OVERALL');
  const totalBudgetLimit = overallBudget 
    ? overallBudget.monthlyLimit 
    : dashboard.budgetStatuses?.reduce((acc, b) => acc + (b.monthlyLimit || 0), 0) || 0;
  
  const budgetSpent = overallBudget 
    ? overallBudget.actualSpent 
    : expense;

  const budgetRemaining = totalBudgetLimit > 0 ? (totalBudgetLimit - budgetSpent) : 0;
  const budgetUsedPct = totalBudgetLimit > 0 
    ? Math.round((budgetSpent / totalBudgetLimit) * 100) 
    : 0;

  return (
    <section className="metrics-grid" aria-label="Key Financial Metrics">
      {/* 1. Monthly Income */}
      <div className="metric-card card-income">
        <div className="metric-header">
          <span className="metric-label">Monthly Income</span>
          <div className="metric-icon-box">
            <TrendingUp size={20} />
          </div>
        </div>
        <div className="metric-value-row">
          <span className="metric-value">
            ${Number(income).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="metric-badge positive">
            <ArrowUpRight size={13} />
            <span>Active</span>
          </span>
        </div>
        <div className="metric-footer">
          <span>Net Cumulative Balance:</span>
          <strong>${Number(lifetimeBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
        </div>
      </div>

      {/* 2. Monthly Expenses */}
      <div className="metric-card card-expense">
        <div className="metric-header">
          <span className="metric-label">Monthly Expenses</span>
          <div className="metric-icon-box">
            <TrendingDown size={20} />
          </div>
        </div>
        <div className="metric-value-row">
          <span className="metric-value">
            ${Number(expense).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="metric-badge" style={{ background: 'var(--accent-rose-glow)', color: 'var(--accent-rose)' }}>
            <ArrowDownRight size={13} />
            <span>Outflow</span>
          </span>
        </div>
        <div className="metric-footer">
          <span>Spend vs Income:</span>
          <strong>{income > 0 ? ((expense / income) * 100).toFixed(1) : 0}%</strong>
        </div>
      </div>

      {/* 3. Net Savings */}
      <div className="metric-card card-savings">
        <div className="metric-header">
          <span className="metric-label">Net Monthly Savings</span>
          <div className="metric-icon-box">
            <PiggyBank size={20} />
          </div>
        </div>
        <div className="metric-value-row">
          <span className="metric-value" style={{ color: savings >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
            ${Number(savings).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={`metric-badge ${savings >= 0 ? 'positive' : 'warning'}`}>
            <span>{savingsRate}% saved</span>
          </span>
        </div>
        <div className="metric-footer">
          <span>Savings Rate Goal:</span>
          <strong>Target 20%+</strong>
        </div>
      </div>

      {/* 4. Budget Status */}
      <div className="metric-card card-budget">
        <div className="metric-header">
          <span className="metric-label">Budget Remaining</span>
          <div className="metric-icon-box">
            <Target size={20} />
          </div>
        </div>
        <div className="metric-value-row">
          <span className="metric-value">
            ${Number(Math.max(0, budgetRemaining)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={`metric-badge ${budgetUsedPct > 100 ? 'warning' : 'neutral'}`}>
            {budgetUsedPct > 100 ? (
              <>
                <AlertTriangle size={13} />
                <span>Over Limit</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={13} />
                <span>{budgetUsedPct}% used</span>
              </>
            )}
          </span>
        </div>
        <div className="metric-footer">
          <span>Total Monthly Cap:</span>
          <strong>${Number(totalBudgetLimit).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
        </div>
      </div>
    </section>
  );
}
