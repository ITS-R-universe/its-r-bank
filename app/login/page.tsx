'use client'
import { useState, useEffect } from 'react'

export default function LoginPage() {
  const [dark, setDark] = useState(true)
  const [form, setForm] = useState({ name: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const t = localStorage.getItem('its-r-theme')
    if (t === 'light') { setDark(false); document.documentElement.setAttribute('data-theme', 'light') }
    const user = localStorage.getItem('its-r-user')
    if (user) window.location.href = '/wallet'
  }, [])

  const toggleTheme = () => {
    const next = !dark; setDark(next)
    if (next) { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('its-r-theme', 'dark') }
    else { document.documentElement.setAttribute('data-theme', 'light'); localStorage.setItem('its-r-theme', 'light') }
  }

  const inp: React.CSSProperties = { width: '100%', padding: '0.75rem 1rem', background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    if (!form.name.trim()) { setError('Name is required'); setLoading(false); return }
    if (!form.phone.trim() || form.phone.replace(/[^0-9]/g, '').length < 10) { setError('Valid phone number required (10+ digits)'); setLoading(false); return }
    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), phone: form.phone.trim() })
      })
      const d = await r.json()
      if (!r.ok) { setError(d.error || 'Login failed'); return }
      localStorage.setItem('its-r-user', JSON.stringify(d.user))
      window.location.href = '/wallet'
    } catch { setError('Something went wrong. Try again.') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'system-ui,sans-serif', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderBottom: '1px solid var(--border)' }}>
        <a href="/" style={{ color: 'var(--gold)', fontWeight: 800, textDecoration: 'none' }}>🏦 ITS-R Bank</a>
        <button onClick={toggleTheme} style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}>
          {dark ? '☀️ Day' : '🌙 Night'}
        </button>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>🏦</div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.375rem' }}>Sign In</h1>
            <p style={{ color: 'var(--sub)', fontSize: '0.9rem' }}>Enter your name and phone number to access your wallet</p>
          </div>

          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '1rem', padding: '2rem' }}>
            {error && <div style={{ background: '#ef444422', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--sub)', marginBottom: '0.375rem' }}>Full Name</label>
                <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" style={inp} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--sub)', marginBottom: '0.375rem' }}>Phone Number</label>
                <input type="tel" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="03XX-XXXXXXX" style={inp} />
              </div>
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.875rem', background: 'var(--gold)', color: '#000', fontWeight: 700, border: 'none', borderRadius: '0.5rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontSize: '1rem' }}>
                {loading ? 'Signing in...' : '→ Access My Wallet'}
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', color: 'var(--sub)', fontSize: '0.8rem', marginTop: '1rem', lineHeight: 1.6 }}>
            New user? Just enter your details — account is created automatically.<br />
            No password needed.
          </p>
        </div>
      </div>

      <footer style={{ textAlign: 'center', padding: '1.5rem', borderTop: '1px solid var(--border)', color: 'var(--sub)', fontSize: '0.75rem' }}>
        ITS-R Universe | In loving memory of Roshan Ali Sahab 🤲
      </footer>
    </div>
  )
}