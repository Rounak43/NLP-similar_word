/**
 * EmptyState – Shown when a feature has no results yet.
 */
import React from 'react';

function EmptyState({ icon, title = 'No results yet', description, action }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '48px 24px', textAlign: 'center',
      animation: 'fadeIn 0.4s ease'
    }}>
      {icon && (
        <div style={{
          fontSize: 48, marginBottom: 16, opacity: 0.35,
          animation: 'float 3s ease-in-out infinite'
        }}>
          {icon}
        </div>
      )}
      <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
        {title}
      </h3>
      {description && (
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', maxWidth: 360, lineHeight: 1.6 }}>
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: 20 }}>{action}</div>}
    </div>
  );
}

export default EmptyState;
