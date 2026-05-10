/**
 * ApiHealthSection – GET /health
 * Displays backend diagnostic information.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { RiHeartPulseLine, RiRefreshLine, RiBrainLine, RiBookOpenLine, RiCheckboxCircleLine, RiCloseCircleLine } from 'react-icons/ri';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import { getHealth, getVocabStats } from '../services/api';

function InfoRow({ icon, label, value, valueColor }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 0', borderBottom: '1px solid var(--border-default)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: 'var(--text-muted)', display: 'flex' }}>{icon}</span>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{label}</span>
      </div>
      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: valueColor || 'var(--text-primary)' }}>
        {value}
      </span>
    </div>
  );
}

function ApiHealthSection() {
  const [health, setHealth]   = useState(null);
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [lastChecked, setLastChecked] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [h, s] = await Promise.allSettled([getHealth(), getVocabStats()]);
      if (h.status === 'fulfilled') setHealth(h.value);
      else { setHealth(null); setError(h.reason?.userMessage || 'Backend unreachable.'); }
      if (s.status === 'fulfilled') setStats(s.value);
      setLastChecked(new Date());
    } catch {
      setHealth(null); setError('Backend unreachable.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const isHealthy = health?.status === 'healthy';

  return (
    <div className="animate-fadeIn">
      <div className="section-header">
        <h1 className="section-title">API <span className="gradient-text">Health</span></h1>
        <p className="section-subtitle">Real-time backend status and NLP model diagnostics.</p>
      </div>

      {/* Status banner */}
      <div style={{
        padding: '20px 24px', borderRadius: 'var(--radius-lg)', marginBottom: 24,
        background: isHealthy ? 'var(--color-success-bg)' : error ? 'var(--color-error-bg)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isHealthy ? 'rgba(16,185,129,0.3)' : error ? 'rgba(239,68,68,0.3)' : 'var(--border-default)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {loading ? (
            <Loader size={28} />
          ) : isHealthy ? (
            <RiCheckboxCircleLine size={32} color="var(--color-success)" />
          ) : (
            <RiCloseCircleLine size={32} color="var(--color-error)" />
          )}
          <div>
            <div style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)', color: isHealthy ? 'var(--color-success)' : 'var(--color-error)' }}>
              {loading ? 'Checking…' : isHealthy ? 'Backend Healthy' : 'Backend Unavailable'}
            </div>
            {lastChecked && (
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                Last checked: {lastChecked.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={fetchData} disabled={loading}>
          {loading ? <Loader size={14} /> : <RiRefreshLine size={14} />}
          Refresh Status
        </button>
      </div>

      {error && !isHealthy && (
        <div style={{ marginBottom: 20 }}>
          <ErrorAlert type="error" message={error} onDismiss={() => setError('')} />
        </div>
      )}

      {/* Health details */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="icon-wrapper"><RiHeartPulseLine size={18} /></div>
            <div className="card-title">Health Endpoint <code style={{ fontSize: 11, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4, marginLeft: 6 }}>GET /health</code></div>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 44 }} />)}
            </div>
          ) : health ? (
            <>
              <InfoRow icon={<RiHeartPulseLine size={16} />} label="Status" value={health.status} valueColor="var(--color-success)" />
              <InfoRow icon={<RiBrainLine size={16} />} label="Model Loaded" value={health.model_loaded ? 'Yes' : 'No'} valueColor={health.model_loaded ? 'var(--color-success)' : 'var(--color-error)'} />
              <InfoRow icon={<RiBookOpenLine size={16} />} label="Vocab Size (from health)" value={health.vocab_size?.toLocaleString() ?? '—'} />
            </>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', textAlign: 'center', padding: '16px 0' }}>
              No data available
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="icon-wrapper"><RiBookOpenLine size={18} /></div>
            <div className="card-title">Vocabulary Stats <code style={{ fontSize: 11, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4, marginLeft: 6 }}>GET /vocab/stats</code></div>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 44 }} />)}
            </div>
          ) : stats ? (
            <>
              <InfoRow icon={<RiBookOpenLine size={16} />} label="Vocabulary Size" value={stats.vocab_size?.toLocaleString()} />
              <InfoRow icon={<RiHeartPulseLine size={16} />} label="Vector Dimensions" value={`${stats.vector_dimensions}d`} />
              <InfoRow icon={<RiBrainLine size={16} />} label="Model" value={stats.model} />
            </>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', textAlign: 'center', padding: '16px 0' }}>
              {error ? 'Model stats unavailable' : 'No data available'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApiHealthSection;
