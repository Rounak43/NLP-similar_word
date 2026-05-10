/**
 * Navbar – Top navigation bar for the dashboard.
 * Shows logo, backend status chip, user avatar, and logout button.
 */
import React, { useState, useEffect } from 'react';
import {
  RiBrainLine, RiLogoutBoxLine, RiMenuLine, RiCloseLine
} from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import { getHealth } from '../services/api';

function Navbar({ onMenuToggle, sidebarOpen }) {
  const { user, logout } = useAuth();
  const [backendOk, setBackendOk] = useState(null); // null=checking, true, false

  // Check backend health on mount and every 30s
  useEffect(() => {
    const check = async () => {
      try { await getHealth(); setBackendOk(true); }
      catch  { setBackendOk(false); }
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header style={{
      height: 'var(--navbar-height)', background: 'rgba(15,23,42,0.9)',
      backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-default)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', position: 'sticky', top: 0, zIndex: 50,
      gap: 16
    }}>
      {/* Left: hamburger + logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={onMenuToggle}
          className="btn btn-ghost btn-sm"
          style={{ padding: '8px', borderRadius: '10px', display: 'flex' }}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <RiBrainLine size={18} color="white" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            LexiMind
          </span>
        </div>
      </div>

      {/* Right: status chip + user + logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Backend status chip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 12px', borderRadius: 'var(--radius-full)',
          background: backendOk === true ? 'var(--color-success-bg)' : backendOk === false ? 'var(--color-error-bg)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${backendOk === true ? 'rgba(16,185,129,0.25)' : backendOk === false ? 'rgba(239,68,68,0.25)' : 'var(--border-default)'}`,
          fontSize: 12, fontWeight: 600,
          color: backendOk === true ? 'var(--color-success)' : backendOk === false ? 'var(--color-error)' : 'var(--text-muted)'
        }}>
          <span className={`status-dot ${backendOk === true ? 'status-dot-success' : backendOk === false ? 'status-dot-error' : ''}`}
            style={{ width: 7, height: 7, borderRadius: '50%', background: backendOk === null ? 'var(--text-muted)' : undefined }} />
          {backendOk === null ? 'Checking…' : backendOk ? 'Model Ready' : 'Backend Offline'}
        </div>

        {/* User avatar */}
        <div data-tooltip={user?.email} style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--gradient-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: 'white', cursor: 'default',
          letterSpacing: '0.02em'
        }}>
          {user?.initials || 'U'}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="btn btn-ghost btn-sm"
          style={{ padding: '8px 12px', gap: 6, display: 'flex', alignItems: 'center' }}
          data-tooltip="Logout"
          aria-label="Logout"
        >
          <RiLogoutBoxLine size={17} />
          <span style={{ fontSize: 13 }}>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
