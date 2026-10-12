import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';

export default function MonthlyTrendsChart({ 
  trends = [], 
  selectedMonth, 
  onSelectMonth, 
  selectedYear 
}) {
  const [hoveredMonth, setHoveredMonth] = useState(null);

  // Compute maximum value for Y-axis scaling
  const maxVal = Math.max(
    ...trends.map(t => Math.max(t.totalIncome || 0, t.totalExpense || 0)),
    1000
  );
  // Round up to nearest nice round number
  const yMax = Math.ceil(maxVal / 1000) * 1000;

  const chartHeight = 200;
  const chartWidth = 720;
  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const barGroupWidth = innerWidth / (trends.length || 12);
  const singleBarWidth = Math.min(16, barGroupWidth * 0.32);

  return (
    <div className="card-panel">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">
            <BarChart3 size={20} style={{ color: 'var(--accent-indigo)' }} />
            <span>Monthly Cashflow Trends ({selectedYear})</span>
          </h2>
          <p className="panel-subtitle">
            Side-by-side comparison of annual Income vs Expenses. Click any month to view details.
          </p>
        </div>

        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-dot income"></div>
            <span>Income</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot expense"></div>
            <span>Expenses</span>
          </div>
        </div>
      </div>

      <div className="chart-container" style={{ position: 'relative' }}>
        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          role="img"
          aria-label="Annual income and expense bar chart"
        >
          {/* Horizontal Gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = paddingTop + innerHeight * (1 - pct);
            const val = Math.round(yMax * pct);
            return (
              <g key={idx}>
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={chartWidth - paddingRight} 
                  y2={y} 
                  stroke="var(--border-subtle)" 
                  strokeDasharray="4 4" 
                />
                <text 
                  x={paddingLeft - 8} 
                  y={y + 4} 
                  fill="var(--text-subtle)" 
                  fontSize="10" 
                  textAnchor="end"
                >
                  ${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                </text>
              </g>
            );
          })}

          {/* Bars for Each Month */}
          {trends.map((m, idx) => {
            const groupX = paddingLeft + idx * barGroupWidth;
            const centerX = groupX + barGroupWidth / 2;

            const incHeight = ((m.totalIncome || 0) / yMax) * innerHeight;
            const expHeight = ((m.totalExpense || 0) / yMax) * innerHeight;

            const incY = paddingTop + innerHeight - incHeight;
            const expY = paddingTop + innerHeight - expHeight;

            const isSelected = selectedMonth === m.month;
            const isHovered = hoveredMonth === m.month;

            return (
              <g 
                key={m.month} 
                style={{ cursor: 'pointer' }}
                onClick={() => onSelectMonth(m.month)}
                onMouseEnter={() => setHoveredMonth(m.month)}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                {/* Active Month Column Background Highlight */}
                {(isSelected || isHovered) && (
                  <rect 
                    x={groupX + 4} 
                    y={paddingTop} 
                    width={barGroupWidth - 8} 
                    height={innerHeight} 
                    rx={6}
                    fill={isSelected ? 'var(--accent-indigo-glow)' : 'rgba(255, 255, 255, 0.03)'} 
                  />
                )}

                {/* Income Bar */}
                <rect 
                  x={centerX - singleBarWidth - 2} 
                  y={incY} 
                  width={singleBarWidth} 
                  height={Math.max(2, incHeight)} 
                  rx={4}
                  fill="#10b981" 
                  opacity={isHovered || isSelected ? 1 : 0.85}
                  style={{ transition: 'all 0.3s ease' }}
                />

                {/* Expense Bar */}
                <rect 
                  x={centerX + 2} 
                  y={expY} 
                  width={singleBarWidth} 
                  height={Math.max(2, expHeight)} 
                  rx={4}
                  fill="#f43f5e" 
                  opacity={isHovered || isSelected ? 1 : 0.85}
                  style={{ transition: 'all 0.3s ease' }}
                />

                {/* Month Name Label */}
                <text 
                  x={centerX} 
                  y={chartHeight - 8} 
                  fill={isSelected ? 'var(--accent-indigo)' : 'var(--text-muted)'} 
                  fontSize="11" 
                  fontWeight={isSelected ? '700' : '500'}
                  textAnchor="middle"
                >
                  {m.monthName}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredMonth && (() => {
          const item = trends.find(t => t.month === hoveredMonth);
          if (!item) return null;
          return (
            <div 
              style={{
                position: 'absolute',
                top: '12px',
                right: '16px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '12px',
                boxShadow: 'var(--shadow-card)',
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                zIndex: 10
              }}
            >
              <strong style={{ color: 'var(--text-main)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px' }}>
                {item.monthName} {selectedYear}
              </strong>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', color: '#10b981' }}>
                <span>Income:</span>
                <strong>${Number(item.totalIncome).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', color: '#f43f5e' }}>
                <span>Expenses:</span>
                <strong>${Number(item.totalExpense).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', color: 'var(--text-main)', borderTop: '1px dashed var(--border-subtle)', paddingTop: '4px' }}>
                <span>Net Savings:</span>
                <strong>${Number(item.netSavings).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
