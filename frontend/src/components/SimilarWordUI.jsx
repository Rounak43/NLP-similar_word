import React, { useState } from 'react';
import './SimilarWordUI.css';

const BASE = 'http://localhost:8000';

const DEMO_SIMILAR = {
  king: [["queen",0.7502],["prince",0.7354],["throne",0.7121],["royal",0.6934],["crown",0.6812],["monarch",0.6699],["reign",0.6543],["palace",0.6412],["emperor",0.6301],["knight",0.6102]],
  ocean: [["sea",0.8901],["waters",0.7823],["atlantic",0.7654],["pacific",0.7501],["wave",0.7344],["shore",0.7102],["marine",0.6945],["coastal",0.6812],["reef",0.6634],["tide",0.6501]],
  happy: [["glad",0.8201],["pleased",0.7954],["cheerful",0.7712],["delighted",0.7501],["joyful",0.7345],["content",0.7201],["satisfied",0.7012],["thrilled",0.6901],["elated",0.6823],["ecstatic",0.6712]],
  apple: [["microsoft",0.8112],["google",0.7934],["samsung",0.7712],["iphone",0.7654],["ipad",0.7512],["macbook",0.7321],["android",0.7101],["software",0.6945],["computing",0.6812],["tech",0.6701]],
  science: [["research",0.8401],["technology",0.8212],["biology",0.8034],["chemistry",0.7945],["physics",0.7823],["scientific",0.7701],["laboratory",0.7534],["discovery",0.7401],["innovation",0.7212],["knowledge",0.7101]],
};

function interpretSim(s) {
  if (s >= 0.85) return 'Nearly identical in meaning';
  if (s >= 0.70) return 'Very closely related';
  if (s >= 0.50) return 'Moderately related';
  if (s >= 0.25) return 'Somewhat related';
  if (s >= 0.0)  return 'Weakly related';
  return 'Unrelated or opposite';
}

const ResultBars = ({ results, query }) => {
  if (!results || !results.length) {
    return <div className="empty">No similar words found for "{query}".</div>;
  }
  const max = results[0][1];
  return (
    <>
      {results.map(([w, s]) => {
        const pct = ((s / max) * 100).toFixed(1);
        return (
          <div className="result-bar" key={w}>
            <span className="rword">{w}</span>
            <div className="bar-wrap">
              <div className="bar-fill" style={{ width: `${pct}%` }}></div>
            </div>
            <span className="rscore">{s.toFixed(4)}</span>
          </div>
        );
      })}
    </>
  );
};

export default function SimilarWordUI() {
  const [activeTab, setActiveTab] = useState('similar');

  const [simWord, setSimWord] = useState('');
  const [simTopn, setSimTopn] = useState(10);
  const [simState, setSimState] = useState({ type: 'empty', msg: 'Enter a word above to discover semantically similar words.' });

  const [anPos1, setAnPos1] = useState('');
  const [anPos2, setAnPos2] = useState('');
  const [anNeg, setAnNeg] = useState('');
  const [anState, setAnState] = useState({ type: 'empty', msg: 'Fill in the analogy fields above to solve a word relationship.' });

  const [cmpW1, setCmpW1] = useState('');
  const [cmpW2, setCmpW2] = useState('');
  const [cmpState, setCmpState] = useState({ type: 'empty', msg: '' });

  const findSimilar = async (overrideWord) => {
    const word = (overrideWord !== undefined ? overrideWord : simWord).trim();
    if (!word) {
      setSimState({ type: 'empty', msg: 'Please enter a word.' });
      return;
    }
    if (overrideWord !== undefined) {
      setSimWord(word);
    }
    setSimState({ type: 'loading' });
    try {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 5000);
      const r = await fetch(`${BASE}/similar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, topn: simTopn }),
        signal: abortController.signal
      });
      clearTimeout(timeoutId);
      const d = await r.json();
      if (!d.in_vocabulary) {
        setSimState({ type: 'empty', msg: `Word "${word}" not found in vocabulary.` });
        return;
      }
      setSimState({ type: 'results', data: d.results.map(x => [x.word, x.score]), query: word });
    } catch (err) {
      const demo = DEMO_SIMILAR[word.toLowerCase()];
      if (demo) {
        setSimState({ type: 'results', data: demo.slice(0, simTopn), query: word });
      } else {
        setSimState({ type: 'error', msg: 'Server not reachable. Start your FastAPI backend at localhost:8000. Showing demo for known words: king, ocean, happy, apple, science.' });
      }
    }
  };

  const findAnalogy = async () => {
    const pos1 = anPos1.trim();
    const pos2 = anPos2.trim();
    const neg = anNeg.trim();
    if (!pos1 || !pos2 || !neg) {
      setAnState({ type: 'empty', msg: 'Fill all three fields.' });
      return;
    }
    setAnState({ type: 'loading' });
    try {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 5000);
      const r = await fetch(`${BASE}/analogy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ positive: [pos1, pos2], negative: [neg], topn: 8 }),
        signal: abortController.signal
      });
      clearTimeout(timeoutId);
      const d = await r.json();
      setAnState({ type: 'results', data: d.results.map(x => [x.word, x.score]), query: d.query });
    } catch (err) {
      if (pos1.toLowerCase() === 'king' && pos2.toLowerCase() === 'woman' && neg.toLowerCase() === 'man') {
        setAnState({
          type: 'results',
          data: [["queen",0.8523],["princess",0.8121],["empress",0.7934],["duchess",0.7701],["throne",0.7512],["regent",0.7301],["consort",0.7101],["royal",0.6945]],
          query: 'king + woman − man'
        });
      } else {
        setAnState({ type: 'error', msg: 'Server not reachable. Try the classic demo: king + woman − man.' });
      }
    }
  };

  const compareSim = async (ow1, ow2) => {
    const w1 = (ow1 !== undefined ? ow1 : cmpW1).trim();
    const w2 = (ow2 !== undefined ? ow2 : cmpW2).trim();
    if (!w1 || !w2) return;
    
    if (ow1 !== undefined) setCmpW1(w1);
    if (ow2 !== undefined) setCmpW2(w2);

    setCmpState({ type: 'loading' });
    try {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 5000);
      const r = await fetch(`${BASE}/similarity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word1: w1, word2: w2 }),
        signal: abortController.signal
      });
      clearTimeout(timeoutId);
      if (!r.ok) {
        const errData = await r.json();
        setCmpState({ type: 'error', msg: errData.detail || 'Unknown error' });
        return;
      }
      const d = await r.json();
      setCmpState({ type: 'results', data: d });
    } catch (err) {
      const DEMO_SIM = {['cat|dog']:0.8219,['hot|cold']:0.0893,['love|hate']:-0.0512,['paris|france']:0.7813};
      const key = [w1, w2].map(x => x.toLowerCase()).join('|');
      const key2 = [w2, w1].map(x => x.toLowerCase()).join('|');
      const score = DEMO_SIM[key] ?? DEMO_SIM[key2] ?? null;
      if (score !== null) {
        setCmpState({ type: 'results', data: { word1: w1, word2: w2, similarity: score, interpretation: interpretSim(score) } });
      } else {
        setCmpState({ type: 'error', msg: 'Server not reachable. Try demo pairs: cat/dog, hot/cold, love/hate, paris/france.' });
      }
    }
  };

  const renderState = (state, queryTitle) => {
    if (state.type === 'loading') {
      return <div className="loading"><span className="spinner"></span>Predicting…</div>;
    }
    if (state.type === 'error') {
      return <div className="error-msg">{state.msg}</div>;
    }
    if (state.type === 'empty') {
      if (state.msg) return <div className="empty">{state.msg}</div>;
      return null;
    }
    if (state.type === 'results') {
      return <ResultBars results={state.data} query={state.query || queryTitle} />;
    }
    return null;
  };

  return (
    <div className="similar-word-app">
      <h2 className="sr-only">Similar Word Prediction Tool</h2>
      <div className="server-note">
        Connect this UI to your FastAPI backend at <code>http://localhost:8000</code>. Demo mode shows sample results when the server is not reachable.
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'similar' ? 'active' : ''}`} onClick={() => setActiveTab('similar')}>Similar words</button>
        <button className={`tab ${activeTab === 'analogy' ? 'active' : ''}`} onClick={() => setActiveTab('analogy')}>Analogy</button>
        <button className={`tab ${activeTab === 'compare' ? 'active' : ''}`} onClick={() => setActiveTab('compare')}>Compare two</button>
      </div>

      <div className={`panel ${activeTab === 'similar' ? 'active' : ''}`}>
        <div className="row">
          <div className="field">
            <label>Word to query</label>
            <input type="text" placeholder="e.g. ocean" value={simWord} onChange={e => setSimWord(e.target.value)} onKeyDown={e => e.key === 'Enter' && findSimilar()} />
          </div>
          <div>
            <label>Results</label>
            <input type="number" value={simTopn} min="3" max="30" onChange={e => setSimTopn(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={() => findSimilar()}>Find →</button>
        </div>
        <p className="hint">
          Try: 
          <span className="badge" onClick={() => findSimilar('king')}>king</span>
          <span className="badge" onClick={() => findSimilar('ocean')}>ocean</span>
          <span className="badge" onClick={() => findSimilar('happy')}>happy</span>
          <span className="badge" onClick={() => findSimilar('apple')}>apple</span>
          <span className="badge" onClick={() => findSimilar('science')}>science</span>
        </p>
        <div className="results">
          {renderState(simState, simWord)}
        </div>
      </div>

      <div className={`panel ${activeTab === 'analogy' ? 'active' : ''}`}>
        <div className="analogy-row">
          <div className="field" style={{ flex: 1, minWidth: '120px' }}>
            <label>Positive word 1</label>
            <input type="text" placeholder="king" value={anPos1} onChange={e => setAnPos1(e.target.value)} />
          </div>
          <span className="analogy-op">+</span>
          <div className="field" style={{ flex: 1, minWidth: '120px' }}>
            <label>Positive word 2</label>
            <input type="text" placeholder="woman" value={anPos2} onChange={e => setAnPos2(e.target.value)} />
          </div>
          <span className="analogy-op">−</span>
          <div className="field" style={{ flex: 1, minWidth: '120px' }}>
            <label>Negative word</label>
            <input type="text" placeholder="man" value={anNeg} onChange={e => setAnNeg(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={() => findAnalogy()}>Solve →</button>
        </div>
        <p className="hint">Classic example: king + woman − man ≈ <b>queen</b></p>
        <div className="results">
          {renderState(anState)}
        </div>
      </div>

      <div className={`panel ${activeTab === 'compare' ? 'active' : ''}`}>
        <div className="row">
          <div className="field">
            <label>Word 1</label>
            <input type="text" placeholder="e.g. cat" value={cmpW1} onChange={e => setCmpW1(e.target.value)} onKeyDown={e => e.key === 'Enter' && compareSim()} />
          </div>
          <div className="field">
            <label>Word 2</label>
            <input type="text" placeholder="e.g. dog" value={cmpW2} onChange={e => setCmpW2(e.target.value)} onKeyDown={e => e.key === 'Enter' && compareSim()} />
          </div>
          <button className="btn btn-primary" onClick={() => compareSim()}>Compare →</button>
        </div>
        <p className="hint">
          Try: 
          <span className="badge" onClick={() => compareSim('cat', 'dog')}>cat vs dog</span>
          <span className="badge" onClick={() => compareSim('hot', 'cold')}>hot vs cold</span>
          <span className="badge" onClick={() => compareSim('love', 'hate')}>love vs hate</span>
          <span className="badge" onClick={() => compareSim('paris', 'france')}>paris vs france</span>
        </p>
        <div className="results">
          {cmpState.type === 'loading' && <div className="loading"><span className="spinner"></span>Computing similarity…</div>}
          {cmpState.type === 'error' && <div className="error-msg">{cmpState.msg}</div>}
          {cmpState.type === 'empty' && cmpState.msg && <div className="empty">{cmpState.msg}</div>}
          {cmpState.type === 'results' && cmpState.data && (
            <div className="sim-card">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                <span className="sim-score">{cmpState.data.similarity.toFixed(4)}</span>
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>cosine similarity</span>
              </div>
              <div className="sim-label">{cmpState.data.interpretation}</div>
              <div className="sim-meter">
                <div className="sim-fill" style={{ width: `${Math.max(0, Math.min(100, ((cmpState.data.similarity + 1) / 2) * 100)).toFixed(1)}%` }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                <span>−1 (opposite)</span>
                <span>0 (unrelated)</span>
                <span>+1 (identical)</span>
              </div>
              <hr className="section-sep" />
              <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                <div><span style={{ color: 'var(--color-text-secondary)' }}>Word A</span><br /><b>{cmpState.data.word1}</b></div>
                <div><span style={{ color: 'var(--color-text-secondary)' }}>Word B</span><br /><b>{cmpState.data.word2}</b></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
