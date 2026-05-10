/**
 * SimilarWordsSection – POST /similar
 * Find the top-N most similar words for a given input word.
 */
import React, { useState } from 'react';
import { RiSearchLine, RiRefreshLine, RiDownloadLine, RiFlashlightLine } from 'react-icons/ri';
import ResultCard from '../components/ResultCard';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';
import Loader from '../components/Loader';
import { getSimilarWords } from '../services/api';

// History key in localStorage
const HISTORY_KEY = 'leximind_similar_history';

function SimilarWordsSection() {
  const [word, setWord]       = useState('');
  const [topn, setTopn]       = useState(10);
  const [results, setResults] = useState(null); // null = not searched yet
  const [query, setQuery]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [wordErr, setWordErr] = useState('');

  const handleSubmit = async (inputWord) => {
    const w = (inputWord ?? word).trim().toLowerCase();
    if (!w) { setWordErr('Please enter a word.'); return; }
    setWordErr(''); setError(''); setLoading(true);

    try {
      const data = await getSimilarWords({ word: w, topn: Number(topn) });
      setResults(data.results);
      setQuery(data.query);

      // Save to recent-searches history
      const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      const updated = [w, ...history.filter(h => h !== w)].slice(0, 10);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));

      if (!data.in_vocabulary) {
        setError('This word was not found in the vocabulary. No results returned.');
        setResults([]);
      }
    } catch (e) {
      setError(e.userMessage || 'Failed to fetch similar words.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setWord(''); setResults(null); setQuery(''); setError(''); setWordErr(''); };

  const handleExport = () => {
    if (!results?.length) return;
    const data = JSON.stringify({ query, results }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url;
    a.download = `similar_${query}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fadeIn">
      <div className="section-header">
        <h1 className="section-title">Find <span className="gradient-text">Similar Words</span></h1>
        <p className="section-subtitle">
          Discover semantically related words using GloVe word embeddings.
        </p>
      </div>

      {/* Input card */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="icon-wrapper"><RiSearchLine size={18} /></div>
          <div>
            <div className="card-title">Word Lookup</div>
            <div className="card-subtitle">Enter any English word to find its closest neighbours</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {/* Word input */}
          <div className="input-group" style={{ flex: '2 1 200px' }}>
            <label className="input-label" htmlFor="sim-word">Word</label>
            <input
              id="sim-word" className={`input ${wordErr ? 'input-error' : ''}`}
              placeholder='e.g. "king"'
              value={word}
              onChange={e => { setWord(e.target.value); setWordErr(''); }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              autoComplete="off"
            />
            {wordErr && <span className="input-helper">{wordErr}</span>}
          </div>

          {/* Top N */}
          <div className="input-group" style={{ flex: '1 1 120px' }}>
            <label className="input-label" htmlFor="sim-topn">Top N Results</label>
            <input
              id="sim-topn" type="number" className="input"
              min={1} max={20} value={topn}
              onChange={e => setTopn(Math.max(1, Math.min(20, Number(e.target.value))))}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
          <button
            id="sim-submit"
            className="btn btn-primary"
            onClick={() => handleSubmit()}
            disabled={loading}
          >
            {loading ? <Loader size={16} color="white" /> : <RiSearchLine size={16} />}
            {loading ? 'Searching…' : 'Find Similar Words'}
          </button>

          {/* Try sample */}
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => { setWord('king'); handleSubmit('king'); }}
            disabled={loading}
            data-tooltip='Try with "king"'
            style={{ alignSelf: 'flex-end', marginBottom: 1 }}
          >
            <RiFlashlightLine size={15} /> Try "king"
          </button>

          {results !== null && (
            <button className="btn btn-ghost btn-sm" onClick={handleReset} style={{ alignSelf: 'flex-end', marginBottom: 1 }}>
              <RiRefreshLine size={15} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Error alert */}
      {error && <div style={{ marginBottom: 20 }}><ErrorAlert type={results?.length === 0 ? 'warning' : 'error'} message={error} onDismiss={() => setError('')} /></div>}

      {/* Results */}
      {results !== null && (
        <div className="card animate-fadeIn">
          <div className="card-header" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="icon-wrapper"><RiSearchLine size={18} /></div>
              <div>
                <div className="card-title">
                  Top similar words for{' '}
                  <span className="word-chip" style={{ fontSize: 13, padding: '3px 10px' }}>"{query}"</span>
                </div>
                <div className="card-subtitle">{results.length} results found</div>
              </div>
            </div>
            {results.length > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={handleExport} data-tooltip="Export JSON">
                <RiDownloadLine size={14} /> Export
              </button>
            )}
          </div>

          {results.length === 0 ? (
            <EmptyState icon="🔍" title="No results" description="No similar words found in the vocabulary for this query." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {results.map((r, i) => (
                <ResultCard key={r.word} rank={i + 1} word={r.word} score={r.score} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Initial empty state */}
      {results === null && !loading && (
        <div className="card">
          <EmptyState icon="🔮" title="Ready to explore" description='Enter a word above and click "Find Similar Words" to discover semantically related words using GloVe embeddings.' />
        </div>
      )}
    </div>
  );
}

export default SimilarWordsSection;
