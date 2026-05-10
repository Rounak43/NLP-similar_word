/**
 * Sidebar – Left navigation with menu items and active state highlighting.
 */
import React from 'react';
import {
  RiDashboardLine, RiSearchLine, RiScalesLine, RiMagicLine,
  RiHeartPulseLine, RiInformationLine, RiBrainLine
} from 'react-icons/ri';

const NAV_ITEMS = [
  { id: 'home',      label: 'Dashboard Home', icon: <RiDashboardLine size={18} /> },
  { id: 'similar',   label: 'Similar Words',   icon: <RiSearchLine size={18} /> },
  { id: 'compare',   label: 'Compare Words',   icon: <RiScalesLine size={18} /> },
  { id: 'analogy',   label: 'Analogy Solver',  icon: <RiMagicLine size={18} /> },
  { id: 'health',    label: 'API Health',       icon: <RiHeartPulseLine size={18} /> },
  { id: 'about',     label: 'About Project',   icon: <RiInformationLine size={18} /> },
];

function Sidebar({ activeSection, onSectionChange, isOpen }) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => onSectionChange(activeSection)} // closes on outside click
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 39, display: 'none'
          }}
          className="sidebar-overlay"
        />
      )}

      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: 'var(--sidebar-width)',
        background: 'rgba(15,23,42,0.97)',
        backdropFilter: 'blur(12px)',
        borderRight: '1px solid var(--border-default)',
        display: 'flex', flexDirection: 'column',
        zIndex: 40,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
        overflowY: 'auto',
      }}>
        {/* Brand */}
        <div style={{
          height: 'var(--navbar-height)', display: 'flex', alignItems: 'center',
          gap: 10, padding: '0 20px',
          borderBottom: '1px solid var(--border-default)',
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <RiBrainLine size={18} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              LexiMind
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: -1 }}>
              Word Intelligence
            </div>
          </div>
        </div>

        {/* Nav label */}
        <div style={{ padding: '20px 16px 8px', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Navigation
        </div>

        {/* Nav items */}
        <nav style={{ padding: '0 10px', flex: 1 }}>
          {NAV_ITEMS.map(item => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 14px', borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--bg-active)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(99,102,241,0.3)' : 'transparent'}`,
                  color: isActive ? 'var(--color-primary-light)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: 'var(--font-size-sm)',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  marginBottom: 2, textAlign: 'left',
                  position: 'relative',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span style={{
                    position: 'absolute', left: 0, top: '20%', bottom: '20%',
                    width: 3, borderRadius: '0 4px 4px 0',
                    background: 'var(--gradient-primary)'
                  }} />
                )}
                <span style={{ opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{
          padding: '16px 20px', borderTop: '1px solid var(--border-default)',
          fontSize: 11, color: 'var(--text-muted)'
        }}>
          <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>LexiMind v1.0</div>
          <div>GloVe · FastAPI · React</div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
