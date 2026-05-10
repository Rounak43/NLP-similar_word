/**
 * LoginPage – Full-screen premium login UI with glassmorphism card.
 * Mock authentication stored in localStorage via AuthContext.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RiEyeLine, RiEyeOffLine, RiBrainLine, RiSearchLine, RiScalesLine, RiMagicLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

function LoginPage() {
  const { login, loginAsDemo, isAuthenticated } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/dashboard';

  // ── If already logged in, redirect immediately ──
  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});
  const [globalErr, setGlobalErr] = useState('');

  const validate = () => {
    const e = {};
    if (!email.trim())    e.email    = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email.';
    if (!password.trim()) e.password = 'Password is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setGlobalErr('');
    // Small artificial delay for UX realism
    await new Promise(r => setTimeout(r, 500));
    const result = login(email, password, remember);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setGlobalErr(result.error);
    }
    setLoading(false);
  };

  const handleDemo = async () => {
    setLoading(true); setGlobalErr('');
    await new Promise(r => setTimeout(r, 400));
    loginAsDemo();
    navigate(from, { replace: true });
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--gradient-bg)', padding: '24px', position: 'relative', overflow: 'hidden'
    }}>
      {/* Decorative background blobs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-5%', right: '-5%', width: '35vw', height: '35vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '50%', right: '15%', width: '20vw', height: '20vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />

      {/* Main card */}
      <div style={{
        display: 'flex', maxWidth: 960, width: '100%',
        borderRadius: 'var(--radius-xl)',
        background: 'rgba(30,41,59,0.8)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
        overflow: 'hidden', animation: 'fadeInUp 0.5s ease'
      }}>

        {/* ── Left branding panel (desktop only) ── */}
        <div style={{
          flex: '1.1', padding: '48px 40px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 60%, rgba(6,182,212,0.08) 100%)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 32,
        }} className="login-branding">
          {/* Logo */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow)' }}>
                <RiBrainLine size={26} color="white" />
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 900, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.03em' }}>
                  LexiMind
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-accent)', fontWeight: 500, marginTop: -2 }}>
                  AI Word Intelligence
                </div>
              </div>
            </div>

            <h1 style={{ fontSize: 30, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 14, letterSpacing: '-0.02em' }}>
              Semantic Intelligence<br />
              <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                at Your Fingertips
              </span>
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Explore similar words, compare semantic meaning, and solve word analogies with vector-based NLP powered by GloVe embeddings.
            </p>
          </div>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: <RiSearchLine size={15} />, text: 'Find semantically similar words instantly' },
              { icon: <RiScalesLine size={15} />, text: 'Measure cosine similarity between any two words' },
              { icon: <RiMagicLine size={15} />,  text: 'Solve word analogies with vector arithmetic' },
            ].map(f => (
              <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-light)', flexShrink: 0 }}>
                  {f.icon}
                </div>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Decorative code snippet */}
          <div style={{
            padding: 16, borderRadius: 'var(--radius-md)',
            background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(99,102,241,0.2)',
            fontFamily: 'monospace', fontSize: 12, color: 'var(--color-primary-light)', lineHeight: 1.7
          }}>
            <span style={{ color: 'var(--text-muted)' }}># GloVe vector arithmetic</span><br />
            king − man + woman <span style={{ color: 'var(--color-accent)' }}>≈</span>{' '}
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>queen</span>
          </div>
        </div>

        {/* ── Right login form ── */}
        <div style={{ flex: 1, padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6, letterSpacing: '-0.02em' }}>
              Welcome back
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Sign in to access the NLP dashboard
            </p>
          </div>

          {/* Global error */}
          {globalErr && (
            <div className="alert alert-error" style={{ marginBottom: 20 }}>
              {globalErr}
            </div>
          )}

          <form onSubmit={handleLogin} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Email */}
            <div className="input-group">
              <label className="input-label" htmlFor="login-email">Email address</label>
              <input
                id="login-email" type="email"
                className={`input ${errors.email ? 'input-error' : ''}`}
                placeholder="you@example.com"
                value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                autoComplete="email"
              />
              {errors.email && <span className="input-helper">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="input-group">
              <label className="input-label" htmlFor="login-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password" type={showPw ? 'text' : 'password'}
                  className={`input ${errors.password ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  value={password} onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                  style={{ paddingRight: 44 }} autoComplete="current-password"
                />
                <button
                  type="button" onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                </button>
              </div>
              {errors.password && <span className="input-helper">{errors.password}</span>}
            </div>

            {/* Remember me + Forgot */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
                <input
                  type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                  style={{ accentColor: 'var(--color-primary)', width: 15, height: 15 }}
                />
                Remember me
              </label>
              <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--color-primary-light)' }}>
                Forgot password?
              </button>
            </div>

            {/* Login button */}
            <button
              id="login-submit" type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
              style={{ marginTop: 4 }}
            >
              {loading ? <Loader size={18} color="white" /> : null}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div className="divider" style={{ flex: 1, margin: 0 }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>or</span>
            <div className="divider" style={{ flex: 1, margin: 0 }} />
          </div>

          {/* Demo login */}
          <button
            id="demo-login" type="button"
            className="btn btn-ghost btn-full"
            onClick={handleDemo} disabled={loading}
            style={{ borderColor: 'rgba(6,182,212,0.3)', color: 'var(--color-accent)' }}
          >
            <RiBrainLine size={16} />
            Continue as Demo
          </button>

          <p style={{ marginTop: 24, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
            This is a college project demo. Any email &amp; password works, or click Demo to skip login.
          </p>
        </div>
      </div>

      {/* Hide branding panel on mobile */}
      <style>{`
        @media (max-width: 700px) {
          .login-branding { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default LoginPage;
