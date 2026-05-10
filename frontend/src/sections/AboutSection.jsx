/**
 * AboutSection – Project information and explanation of NLP concepts.
 * Designed for a college project demo / viva presentation.
 */
import React from 'react';
import { RiBrainLine, RiCodeLine, RiServerLine, RiGitBranchLine, RiBookOpenLine, RiArrowRightLine } from 'react-icons/ri';

const TECH_STACK = [
  { icon: <RiBrainLine size={18} />, label: 'GloVe Embeddings', desc: 'glove-wiki-gigaword-50 · 400K vocab · 50d vectors' },
  { icon: <RiServerLine size={18} />, label: 'FastAPI Backend',  desc: 'Python · Gensim · REST API with CORS' },
  { icon: <RiCodeLine size={18} />,   label: 'React Frontend',   desc: 'Vite · React Router · Axios · React Icons' },
  { icon: <RiGitBranchLine size={18} />, label: 'Architecture',  desc: 'SPA with mock auth · Protected routes · Context API' },
];

const FEATURES = [
  { emoji: '🔍', title: 'Similar Words',    desc: 'Find the top-N semantically closest words using cosine distance in vector space.' },
  { emoji: '⚖️', title: 'Word Comparison',  desc: 'Compute and visualize the cosine similarity score between any two words.' },
  { emoji: '🧮', title: 'Analogy Solver',   desc: 'Solve A + B − C = ? using vector arithmetic, the classic NLP test.' },
  { emoji: '📊', title: 'API Diagnostics',  desc: 'Real-time health check and vocabulary statistics from the backend.' },
];

function AboutSection() {
  return (
    <div className="animate-fadeIn">
      <div className="section-header">
        <h1 className="section-title">About <span className="gradient-text">LexiMind</span></h1>
        <p className="section-subtitle">Project overview, technology stack, and NLP concepts.</p>
      </div>

      {/* Hero card */}
      <div style={{
        padding: '32px', borderRadius: 'var(--radius-xl)', marginBottom: 24,
        background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 50%, rgba(6,182,212,0.08) 100%)',
        border: '1px solid rgba(99,102,241,0.25)',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -30, left: -30, width: 130, height: 130, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, position: 'relative' }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16, background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <RiBrainLine size={30} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 6, letterSpacing: '-0.02em' }}>
              LexiMind
            </h2>
            <p style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-accent)', fontWeight: 500, marginBottom: 12 }}>
              AI-powered Semantic Word Intelligence
            </p>
            <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 620 }}>
              This frontend demonstrates <strong style={{ color: 'var(--text-primary)' }}>semantic similarity</strong>,{' '}
              <strong style={{ color: 'var(--text-primary)' }}>vector arithmetic</strong>, and{' '}
              <strong style={{ color: 'var(--text-primary)' }}>word analogy reasoning</strong> using NLP embeddings.
              It connects to a FastAPI backend serving a pre-trained GloVe model with a vocabulary of 400K words.
            </p>
          </div>
        </div>
      </div>

      {/* What are word embeddings? */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="icon-wrapper"><RiBookOpenLine size={18} /></div>
          <div className="card-title">What are Word Embeddings?</div>
        </div>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p>
            <strong style={{ color: 'var(--text-primary)' }}>Word embeddings</strong> are dense numerical vector representations of words.
            Instead of treating words as isolated symbols, embeddings encode semantic meaning — words with similar meanings
            are represented by similar vectors in a high-dimensional space.
          </p>
          <p>
            <strong style={{ color: 'var(--text-primary)' }}>GloVe (Global Vectors for Word Representation)</strong> is a pre-trained
            embedding model created by Stanford. It was trained on billions of words from Wikipedia and news articles,
            capturing rich semantic relationships. This app uses the <em>glove-wiki-gigaword-50</em> variant with
            50-dimensional vectors and a 400K-word vocabulary.
          </p>
          <p>
            <strong style={{ color: 'var(--text-primary)' }}>Cosine similarity</strong> measures the angle between two vectors.
            A score of 1.0 means the words are identical in meaning; 0.0 means unrelated; negative means opposite.
            This metric powers both the "Compare Words" and "Find Similar Words" features.
          </p>
          <div style={{
            padding: 16, background: 'rgba(99,102,241,0.08)', borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(99,102,241,0.2)', fontFamily: 'monospace', fontSize: 13,
            color: 'var(--color-primary-light)'
          }}>
            king − man + woman ≈ queen <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-family)' }}> ← vector arithmetic</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>Features</h2>
        <div className="grid-2">
          {FEATURES.map(f => (
            <div key={f.title} className="card" style={{ display: 'flex', gap: 14 }}>
              <div style={{ fontSize: 28, flexShrink: 0, lineHeight: 1 }}>{f.emoji}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 'var(--font-size-md)', color: 'var(--text-primary)', marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="card">
        <div className="card-header">
          <div className="icon-wrapper"><RiCodeLine size={18} /></div>
          <div className="card-title">Technology Stack</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {TECH_STACK.map(item => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 14px', borderRadius: 'var(--radius-md)',
              background: 'rgba(255,255,255,0.025)', border: '1px solid var(--border-default)'
            }}>
              <div className="icon-wrapper">{item.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{item.label}</div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div>
              </div>
              <RiArrowRightLine size={14} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
            </div>
          ))}
        </div>

        {/* CORS note */}
        <div style={{
          marginTop: 20, padding: 14, borderRadius: 'var(--radius-md)',
          background: 'var(--color-info-bg)', border: '1px solid rgba(6,182,212,0.25)',
          fontSize: 'var(--font-size-sm)', color: 'var(--color-info)'
        }}>
          <strong>CORS:</strong> The FastAPI backend has CORS enabled for all origins (<code>*</code>),
          so this frontend can call it from any local dev port without configuration.
        </div>
      </div>
    </div>
  );
}

export default AboutSection;
