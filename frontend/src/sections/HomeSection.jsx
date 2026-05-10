/**
 * HomeSection – Dashboard home with stat cards loaded from /health and /vocab/stats.
 */
import React, { useEffect, useState } from 'react';
import {
  RiHeartPulseLine, RiBrainLine, RiBookOpenLine, RiStackLine,
  RiSearchLine, RiScalesLine, RiMagicLine, RiArrowRightLine
} from 'react-icons/ri';
import StatCard from '../components/StatCard';
import ErrorAlert from '../components/ErrorAlert';
import { getHealth, getVocabStats } from '../services/api';

function HomeSection({ onNavigate }) {
  const [health, setHealth]     = useState(null);
  const [stats, setStats]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [h, s] = await Promise.all([getHealth(), getVocabStats()]);
        setHealth(h);
        setStats(s);
      } catch (e) {
        setError(e.userMessage || 'Failed to load backend data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const QUICK_ACTIONS = [
    { label: 'Find Similar Words', desc: 'Discover semantically related words', icon: <RiSearchLine size={20} />, section: 'similar' },
    { label: 'Compare Words',      desc: 'Measure cosine similarity between two words', icon: <RiScalesLine size={20} />, section: 'compare' },
    { label: 'Analogy Solver',     desc: 'Solve king + woman − man = ?', icon: <RiMagicLine size={20} />, section: 'analogy' },
  ];

  return (
    <div className="animate-fadeIn">
      {/* Section header */}
      <div className="section-header">
        <h1 className="section-title">Semantic Intelligence <span className="gradient-text">Dashboard</span></h1>
        <p className="section-subtitle">
          Interact with the NLP engine through word similarity and analogy tools.
        </p>
      </div>

      {/* Backend error banner */}
      {error && (
        <div style={{ marginBottom: 24 }}>
          <ErrorAlert type="error" message={error} onDismiss={() => setError('')} />
        </div>
      )}

      {/* Stat cards */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        <StatCard
          icon={<RiHeartPulseLine size={22} />}
          label="Backend Status"
          value={loading ? null : health ? (health.status === 'healthy' ? 'Healthy' : 'Degraded') : 'Unavailable'}
          subValue={health ? 'API is responding' : 'Cannot reach server'}
          status={loading ? null : health?.status === 'healthy' ? 'success' : 'error'}
          loading={loading}
        />
        <StatCard
          icon={<RiBrainLine size={22} />}
          label="Model Loaded"
          value={loading ? null : health?.model_loaded ? 'Yes' : 'No'}
          subValue={health?.model_loaded ? 'GloVe model active' : 'Model not loaded'}
          status={loading ? null : health?.model_loaded ? 'success' : 'error'}
          loading={loading}
        />
        <StatCard
          icon={<RiBookOpenLine size={22} />}
          label="Vocabulary Size"
          value={loading ? null : stats?.vocab_size ? stats.vocab_size.toLocaleString() : (health?.vocab_size?.toLocaleString() ?? '—')}
          subValue="Unique word vectors"
          loading={loading}
        />
        <StatCard
          icon={<RiStackLine size={22} />}
          label="Vector Dimensions"
          value={loading ? null : stats?.vector_dimensions ? `${stats.vector_dimensions}d` : '—'}
          subValue={stats?.model || 'Embedding model'}
          loading={loading}
        />
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>
          Quick Actions
        </h2>
        <div className="grid-2" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
          {QUICK_ACTIONS.map(action => (
            <button
              key={action.section}
              onClick={() => onNavigate(action.section)}
              className="card"
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-default)',
                cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
            >
              <div className="icon-wrapper icon-wrapper-lg" style={{ color: 'var(--color-accent)' }}>
                {action.icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 'var(--font-size-md)', color: 'var(--text-primary)', marginBottom: 4 }}>
                  {action.label}
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                  {action.desc}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-primary-light)', fontSize: 13, fontWeight: 600, marginTop: 4 }}>
                Open <RiArrowRightLine size={14} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomeSection;
