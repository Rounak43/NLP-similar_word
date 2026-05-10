/**
 * StatCard – Dashboard summary card for a single metric.
 */
import React from 'react';

function StatCard({ icon, label, value, subValue, status, loading }) {
  // status: 'success' | 'error' | 'warning' | null
  const statusColors = {
    success: 'var(--color-success)',
    error:   'var(--color-error)',
    warning: 'var(--color-warning)',
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', overflow: 'hidden' }}>
      {/* Subtle gradient accent in top-right */}
      <div style={{
        position: 'absolute', top: -20, right: -20, width: 80, height: 80,
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />

      {/* Icon + label row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="icon-wrapper icon-wrapper-lg">
          {icon}
        </div>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', fontWeight: 500 }}>
          {label}
        </span>
      </div>

      {/* Value */}
      {loading ? (
        <div>
          <div className="skeleton" style={{ height: 32, width: '60%', marginBottom: 6 }} />
          <div className="skeleton" style={{ height: 14, width: '40%' }} />
        </div>
      ) : (
        <div>
          <div style={{
            fontSize: 28, fontWeight: 800, lineHeight: 1.2,
            color: status ? statusColors[status] : 'var(--text-primary)'
          }}>
            {value ?? '—'}
          </div>
          {subValue && (
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 4 }}>
              {subValue}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StatCard;
