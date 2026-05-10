/**
 * AnalogySection – POST /analogy
 * Solve word analogies: king + woman - man = ?
 */
import React, { useState } from 'react';
import { RiMagicLine, RiFlashlightLine, RiRefreshLine, RiDownloadLine, RiTrophyLine } from 'react-icons/ri';
import ResultCard from '../components/ResultCard';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';
import Loader from '../components/Loader';
import { solveAnalogy } from '../services/api';

function AnalogySection() {
  const [pos1, setPos1]       = useState('');
  const [pos2, setPos2]       = useState('');
  const [neg1, setNeg1]       = useState('');
  const [topn, setTopn]       = useState(5);
  const [results, setResults] = useState(null);
  const [query, setQuery]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [errs, setErrs]       = useState({});

  const validate = () => {
    const e = {};
    if (!pos1.trim()) e.pos1 = 'Required.';
    if (!pos2.trim()) e.pos2 = 'Required.';
    if (!neg1.trim()) e.neg1 = 'Required.';
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setError(''); setLoading(true);
    try {
      const data = await solveAnalogy({
        positive: [pos1.trim().toLowerCase(), pos2.trim().toLowerCase()],
        negative: [neg1.trim().toLowerCase()],
        topn: Number(topn)
      });
      setResults(data.results);
      setQuery(data.query);
    } catch (e) {
      setError(e.userMessage || 'Failed to solve analogy.');
      setResults([]);
    } finally { setLoading(false); }
  };

  const handleReset = () => { setPos1(''); setPos2(''); setNeg1(''); setResults(null); setQuery(''); setError(''); setErrs({}); };

  const tryDemo = () => { setPos1('king'); setPos2('woman'); setNeg1('man'); };

  const handleExport = () => {
    if (!results?.length) return;
    const blob = new Blob([JSON.stringify({ query, results }, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url;
    a.download = `analogy_${query.replace(/[^a-z0-9]/gi, '_')}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const bestResult = results?.[0];

  return (
    <div className="animate-fadeIn">
      <div className="section-header">
        <h1 className="section-title">Analogy <span className="gradient-text">Solver</span></h1>
        <p className="section-subtitle">
          Solve word analogies using vector arithmetic. <em>king + woman − man = ?</em>
        </p>
      </div>

      {/* Input card */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="icon-wrapper"><RiMagicLine size={18} /></div>
          <div>
            <div className="card-title">Word Analogy</div>
            <div className="card-subtitle">Positive words are added, negative word is subtracted in vector space</div>
          </div>
        </div>

        {/* Visual equation preview */}
        {(pos1 || pos2 || neg1) && (
          <div style={{
            padding: '10px 16px', borderRadius: 'var(--radius-md)', marginBottom: 20,
            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
            fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--text-secondary)'
          }}>
            <span style={{ color: 'var(--color-primary-light)' }}>{pos1 || '_'}</span>
            {' + '}
            <span style={{ color: 'var(--color-primary-light)' }}>{pos2 || '_'}</span>
            {' − '}
            <span style={{ color: 'var(--color-error)' }}>{neg1 || '_'}</span>
            {' = '}
            <span style={{ color: 'var(--color-accent)' }}>?</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
          <div className="input-group">
            <label className="input-label" htmlFor="ana-pos1">
              <span style={{ color: 'var(--color-success)', marginRight: 4 }}>+</span> Positive Word 1
            </label>
            <input id="ana-pos1" className={`input ${errs.pos1 ? 'input-error' : ''}`} placeholder='e.g. "king"'
              value={pos1} onChange={e => { setPos1(e.target.value); setErrs(p => ({ ...p, pos1: '' })); }} />
            {errs.pos1 && <span className="input-helper">{errs.pos1}</span>}
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="ana-pos2">
              <span style={{ color: 'var(--color-success)', marginRight: 4 }}>+</span> Positive Word 2
            </label>
            <input id="ana-pos2" className={`input ${errs.pos2 ? 'input-error' : ''}`} placeholder='e.g. "woman"'
              value={pos2} onChange={e => { setPos2(e.target.value); setErrs(p => ({ ...p, pos2: '' })); }} />
            {errs.pos2 && <span className="input-helper">{errs.pos2}</span>}
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="ana-neg1">
              <span style={{ color: 'var(--color-error)', marginRight: 4 }}>−</span> Negative Word
            </label>
            <input id="ana-neg1" className={`input ${errs.neg1 ? 'input-error' : ''}`} placeholder='e.g. "man"'
              value={neg1} onChange={e => { setNeg1(e.target.value); setErrs(p => ({ ...p, neg1: '' })); }} />
            {errs.neg1 && <span className="input-helper">{errs.neg1}</span>}
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="ana-topn">Top N Results</label>
            <input id="ana-topn" type="number" className="input" min={1} max={10} value={topn}
              onChange={e => setTopn(Math.max(1, Math.min(10, Number(e.target.value))))} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader size={16} color="white" /> : <RiMagicLine size={16} />}
            {loading ? 'Solving…' : 'Solve Analogy'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={tryDemo} disabled={loading} data-tooltip="king + woman − man = ?" style={{ alignSelf: 'flex-end', marginBottom: 1 }}>
            <RiFlashlightLine size={15} /> Try Demo
          </button>
          {results !== null && (
            <button className="btn btn-ghost btn-sm" onClick={handleReset} style={{ alignSelf: 'flex-end', marginBottom: 1 }}>
              <RiRefreshLine size={15} /> Reset
            </button>
          )}
        </div>
      </div>

      {error && <div style={{ marginBottom: 20 }}><ErrorAlert type="error" message={error} onDismiss={() => setError('')} /></div>}

      {/* Results */}
      {results !== null && results.length > 0 && (
        <div className="animate-fadeIn">
          {/* Equation display */}
          <div style={{
            textAlign: 'center', padding: '20px', marginBottom: 20,
            background: 'var(--bg-card)', border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)', fontSize: 'var(--font-size-xl)', fontWeight: 700
          }}>
            <span style={{ color: 'var(--color-primary-light)' }}>{pos1}</span>
            <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>+</span>
            <span style={{ color: 'var(--color-primary-light)' }}>{pos2}</span>
            <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>−</span>
            <span style={{ color: 'var(--color-error)' }}>{neg1}</span>
            <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>=</span>
            <span className="gradient-text">{bestResult.word}</span>
          </div>

          {/* Best match card */}
          <div style={{
            padding: 20, marginBottom: 20, borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
            border: '1px solid rgba(99,102,241,0.35)', display: 'flex', alignItems: 'center', gap: 16
          }}>
            <div style={{ fontSize: 36, flexShrink: 0 }}><RiTrophyLine color="var(--color-warning)" /></div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-warning)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                Best Match
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {bestResult.word}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                Score: <strong style={{ color: 'var(--color-primary-light)' }}>{bestResult.score.toFixed(4)}</strong>
              </div>
            </div>
          </div>

          {/* All results */}
          <div className="card">
            <div className="card-header" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="icon-wrapper"><RiMagicLine size={18} /></div>
                <div>
                  <div className="card-title">All Results</div>
                  <div className="card-subtitle">{results.length} candidates found</div>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={handleExport} data-tooltip="Export JSON">
                <RiDownloadLine size={14} /> Export
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {results.map((r, i) => (
                <ResultCard key={r.word} rank={i + 1} word={r.word} score={r.score} />
              ))}
            </div>
          </div>
        </div>
      )}

      {results !== null && results.length === 0 && !error && (
        <div className="card">
          <EmptyState icon="🔮" title="No results" description="The analogy returned no results. Make sure all words are in the model vocabulary." />
        </div>
      )}

      {results === null && !loading && (
        <div className="card">
          <EmptyState icon="🧮" title="Ready to solve" description='Fill in the three word fields and click "Solve Analogy". Classic example: king + woman − man = queen.' />
        </div>
      )}
    </div>
  );
}

export default AnalogySection;
