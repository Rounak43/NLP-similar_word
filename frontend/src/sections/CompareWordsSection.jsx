/**
 * CompareWordsSection – POST /similarity
 * Compute cosine similarity between two words.
 */
import React, { useState } from 'react';
import { RiScalesLine, RiFlashlightLine, RiRefreshLine } from 'react-icons/ri';
import ErrorAlert from '../components/ErrorAlert';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { compareWords } from '../services/api';

/* Score → interpretation mapping for the meter */
const getLevel = (score) => {
  if (score >= 0.85) return { label: 'Nearly Identical',   color: '#10b981', pct: 100 };
  if (score >= 0.70) return { label: 'Very Closely Related', color: '#34d399', pct: 85 };
  if (score >= 0.50) return { label: 'Moderately Related',   color: '#06b6d4', pct: 65 };
  if (score >= 0.25) return { label: 'Somewhat Related',     color: '#6366f1', pct: 45 };
  if (score >= 0.0)  return { label: 'Weakly Related',       color: '#8b5cf6', pct: 28 };
  return               { label: 'Unrelated / Opposite',     color: '#ef4444', pct: 5  };
};

function CompareWordsSection() {
  const [word1, setWord1]     = useState('');
  const [word2, setWord2]     = useState('');
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [w1Err, setW1Err]     = useState('');
  const [w2Err, setW2Err]     = useState('');

  const validate = () => {
    let ok = true;
    if (!word1.trim()) { setW1Err('Required.'); ok = false; } else setW1Err('');
    if (!word2.trim()) { setW2Err('Required.'); ok = false; } else setW2Err('');
    return ok;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setError(''); setLoading(true);
    try {
      const data = await compareWords({ word1: word1.trim().toLowerCase(), word2: word2.trim().toLowerCase() });
      setResult(data);
    } catch (e) {
      setError(e.userMessage || 'Failed to compare words.');
      setResult(null);
    } finally { setLoading(false); }
  };

  const handleReset = () => { setWord1(''); setWord2(''); setResult(null); setError(''); };

  const tryDemo = () => { setWord1('king'); setWord2('queen'); };

  const level = result ? getLevel(result.similarity) : null;

  return (
    <div className="animate-fadeIn">
      <div className="section-header">
        <h1 className="section-title">Compare <span className="gradient-text">Words</span></h1>
        <p className="section-subtitle">Measure the cosine similarity between two words using vector arithmetic.</p>
      </div>

      {/* Input card */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="icon-wrapper"><RiScalesLine size={18} /></div>
          <div>
            <div className="card-title">Word Comparison</div>
            <div className="card-subtitle">Enter two words to see how semantically close they are</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div className="input-group" style={{ flex: '1 1 180px' }}>
            <label className="input-label" htmlFor="cmp-w1">First Word</label>
            <input id="cmp-w1" className={`input ${w1Err ? 'input-error' : ''}`} placeholder='e.g. "king"'
              value={word1} onChange={e => { setWord1(e.target.value); setW1Err(''); }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            {w1Err && <span className="input-helper">{w1Err}</span>}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', paddingTop: 24, flexShrink: 0 }}>
            <span style={{ fontSize: 22, color: 'var(--text-muted)', fontWeight: 300 }}>↔</span>
          </div>

          <div className="input-group" style={{ flex: '1 1 180px' }}>
            <label className="input-label" htmlFor="cmp-w2">Second Word</label>
            <input id="cmp-w2" className={`input ${w2Err ? 'input-error' : ''}`} placeholder='e.g. "queen"'
              value={word2} onChange={e => { setWord2(e.target.value); setW2Err(''); }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            {w2Err && <span className="input-helper">{w2Err}</span>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader size={16} color="white" /> : <RiScalesLine size={16} />}
            {loading ? 'Comparing…' : 'Compare Similarity'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={tryDemo} disabled={loading} data-tooltip='Try "king" vs "queen"' style={{ alignSelf: 'flex-end', marginBottom: 1 }}>
            <RiFlashlightLine size={15} /> Try Demo
          </button>
          {result && (
            <button className="btn btn-ghost btn-sm" onClick={handleReset} style={{ alignSelf: 'flex-end', marginBottom: 1 }}>
              <RiRefreshLine size={15} /> Reset
            </button>
          )}
        </div>
      </div>

      {error && <div style={{ marginBottom: 20 }}><ErrorAlert type="error" message={error} onDismiss={() => setError('')} /></div>}

      {/* Results */}
      {result && (
        <div className="card animate-fadeIn">
          {/* Words as chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
            <span className="word-chip" style={{ fontSize: 16, padding: '8px 18px' }}>{result.word1}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 24, fontWeight: 300 }}>↔</span>
            <span className="word-chip" style={{ fontSize: 16, padding: '8px 18px' }}>{result.word2}</span>
          </div>

          {/* Big score */}
          <div style={{ textAlign: 'center', padding: '12px 0 28px' }}>
            <div style={{
              fontSize: 72, fontWeight: 900, lineHeight: 1,
              background: `linear-gradient(135deg, ${level.color}, #6366f1)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              marginBottom: 8
            }}>
              {result.similarity.toFixed(4)}
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginBottom: 16 }}>
              Cosine Similarity Score
            </div>
            <span className="badge" style={{
              background: `${level.color}1a`, color: level.color,
              border: `1px solid ${level.color}40`,
              fontSize: 14, padding: '6px 18px'
            }}>
              {result.interpretation}
            </span>
          </div>

          {/* Semantic meter */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Unrelated</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Identical</span>
            </div>
            <div className="progress-bar-track" style={{ height: 12, borderRadius: 'var(--radius-full)' }}>
              <div style={{
                height: '100%', borderRadius: 'var(--radius-full)',
                width: `${level.pct}%`,
                background: `linear-gradient(90deg, #6366f1, ${level.color})`,
                transition: 'width 1s ease', boxShadow: `0 0 12px ${level.color}60`
              }} />
            </div>
          </div>

          {/* Interpretation table */}
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', padding: 16, border: '1px solid var(--border-default)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Similarity Scale Reference
            </div>
            {[
              { range: '≥ 0.85', label: 'Nearly identical', color: '#10b981' },
              { range: '≥ 0.70', label: 'Very closely related', color: '#34d399' },
              { range: '≥ 0.50', label: 'Moderately related', color: '#06b6d4' },
              { range: '≥ 0.25', label: 'Somewhat related', color: '#6366f1' },
              { range: '≥ 0.00', label: 'Weakly related', color: '#8b5cf6' },
              { range: '< 0.00', label: 'Unrelated / opposite', color: '#ef4444' },
            ].map(row => (
              <div key={row.range} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: row.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 52 }}>{row.range}</span>
                <span style={{ fontSize: 12, color: row.color === level.color ? row.color : 'var(--text-secondary)', fontWeight: row.color === level.color ? 700 : 400 }}>
                  {row.label} {row.color === level.color ? '← current' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="card">
          <EmptyState icon="⚖️" title="Compare two words" description='Enter two words above and click "Compare Similarity" to see their cosine similarity score and semantic relationship.' />
        </div>
      )}
    </div>
  );
}

export default CompareWordsSection;
