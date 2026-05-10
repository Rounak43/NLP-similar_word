/**
 * ResultCard – A single result row for similar-words / analogy results.
 * Shows rank, word, score badge, and a progress bar.
 */
import React from 'react';

function ResultCard({ rank, word, score, highlight = false, animate = true }) {
  const pct = Math.max(0, Math.min(100, score * 100)).toFixed(1);
  const isTop = rank === 1;

  return (
    <div
      className={animate ? `animate-fadeIn stagger-${Math.min(rank, 5)}` : ''}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '12px 16px',
        background: isTop || highlight
          ? 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))'
          : 'rgba(255,255,255,0.025)',
        border: `1px solid ${isTop || highlight ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 'var(--radius-md)',
        transition: 'all 0.2s ease',
        cursor: 'default',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = isTop || highlight ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.06)'}
    >
      {/* Rank badge */}
      <div style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 700,
        background: isTop ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.07)',
        color: isTop ? 'white' : 'var(--text-muted)',
      }}>
        {rank}
      </div>

      {/* Word */}
      <span style={{
        flex: 1, fontWeight: isTop ? 700 : 600,
        fontSize: isTop ? 'var(--font-size-md)' : 'var(--font-size-base)',
        color: isTop ? 'var(--text-primary)' : 'var(--text-secondary)',
        letterSpacing: '0.01em'
      }}>
        {word}
      </span>

      {/* Score + progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 130 }}>
        <div style={{ flex: 1 }}>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{
                width: `${pct}%`,
                background: isTop ? 'var(--gradient-primary)' : 'linear-gradient(90deg, rgba(99,102,241,0.6), rgba(139,92,246,0.6))'
              }}
            />
          </div>
        </div>
        <span style={{
          fontSize: 'var(--font-size-xs)', fontWeight: 700, minWidth: 44, textAlign: 'right',
          color: isTop ? 'var(--color-primary-light)' : 'var(--text-muted)'
        }}>
          {score.toFixed(4)}
        </span>
      </div>
    </div>
  );
}

export default ResultCard;
