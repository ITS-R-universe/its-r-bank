'use client'
import { useState, useEffect } from 'react'

export default function BankHome() {
  const [dark, setDark] = useState(true)
  const [user, setUser] = useState<{ name: string; phone: string } | null>(null)

  useEffect(() => {
    const t = localStorage.getItem('its-r-theme')
    if (t === 'light') { setDark(false); document.documentElement.setAttribute('data-theme', 'light') }
    const u = localStorage.getItem('its-r-user')
    if (u) { try { setUser(JSON.parse(u)) } catch { /* ignore */ } }
  }, [])

  const toggleTheme = () => {
    const next = !dark; setDark(next)
    if (next) { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('its-r-theme', 'dark') }
    else { document.documentElement.setAttribute('data-theme', 'light'); localStorage.setItem('its-r-theme', 'light') }
  }

  const logout = () => { localStorage.removeItem('its-r-user'); setUser(null) }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'system-ui,sans-serif' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderBottom: '1px solid var(--border)' }}>
        <span style={{ color: 'var(--gold)', fontWeight: 800, fontSize: '1.1rem' }}>🏦 ITS-R Bank</span>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <>
              <a href="/wallet" style={{ color: 'var(--text)', fontSize: '0.9rem', textDecoration: 'none' }}>My Wallet</a>
              <a href="/deposit" style={{ color: 'var(--text)', fontSize: '0.9rem', textDecoration: 'none' }}>Deposit</a>
              <button onClick={logout} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--sub)', padding: '0.35rem 0.7rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}>Logout</button>
            </>
          ) : (
            <a href="/login" style={{ padding: '0.45rem 1rem', background: 'var(--gold)', color: '#000', fontWeight: 700, borderRadius: '0.5rem', fontSize: '0.875rem', textDecoration: 'none' }}>Sign In</a>
          )}
          <button onClick={toggleTheme} style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}>
            {dark ? '☀️ Day' : '🌙 Night'}
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1.5rem' }}>
        {user && (
          <div style={{ background: 'var(--card)', border: '1px solid var(--gold)', borderRadius: '1rem', padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ color: 'var(--gold)', fontWeight: 700 }}>👋 Welcome, {user.name}</span>
              <span style={{ color: 'var(--sub)', fontSize: '0.85rem', marginLeft: '0.75rem' }}>{user.phone}</span>
            </div>
            <a href="/wallet" style={{ padding: '0.5rem 1rem', background: 'var(--gold)', color: '#000', fontWeight: 700, borderRadius: '0.5rem', fontSize: '0.875rem', textDecoration: 'none' }}>View Wallet →</a>
          </div>
        )}

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏦</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>ITS-R Bank</h1>
          <p style={{ color: 'var(--sub)', fontSize: '1.1rem', maxWidth: 500, margin: '0 auto' }}>
            Internal wallet of ITS-R Universe. Deposit PKR via Nayapay, earn ITSR Coins, spend on 2,213 services.
          </p>
          {!user && (
            <a href="/login" style={{ display: 'inline-block', marginTop: '1.5rem', padding: '0.875rem 2rem', background: 'var(--gold)', color: '#000', fontWeight: 700, borderRadius: '0.75rem', fontSize: '1rem', textDecoration: 'none' }}>
              🏦 Sign In to Your Wallet
            </a>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            { icon: '💳', title: 'Your Wallet', desc: 'Check ITSR Coin balance and transaction history', href: user ? '/wallet' : '/login' },
            { icon: '📥', title: 'Deposit PKR', desc: 'Send via Nayapay. 100 PKR = 100 ITSR Coins. Credited after confirmation.', href: user ? '/deposit' : '/login' },
            { icon: '🪙', title: 'ITSR Coins', desc: '1 Trillion total supply. Coins never expire. Spend on any ITS-R service.', href: 'https://its-r-coin.vercel.app' },
          ].map(item => (
            <a key={item.title} href={item.href} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '1rem', padding: '1.5rem', display: 'block', textDecoration: 'none' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{item.icon}</div>
              <h3 style={{ color: 'var(--text)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--sub)', fontSize: '0.875rem', lineHeight: 1.5 }}>{item.desc}</p>
            </a>
          ))}
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--gold)' }}>💸 How to Deposit</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem' }}>
            {[
              { n: '1', t: 'Sign In', d: 'Enter your name and phone number' },
              { n: '2', t: 'Send via Nayapay', d: "Transfer PKR to founder's Nayapay account" },
              { n: '3', t: 'Submit Reference', d: 'Enter transaction ID from your Nayapay app' },
              { n: '4', t: 'Coins Credited', d: 'Founder confirms and coins appear in your wallet' },
            ].map(s => (
              <div key={s.n} style={{ textAlign: 'center', padding: '0.875rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gold)', color: '#000', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.625rem', fontSize: '1rem' }}>{s.n}</div>
                <h4 style={{ marginBottom: '0.3rem', fontSize: '0.875rem', fontWeight: 700 }}>{s.t}</h4>
                <p style={{ color: 'var(--sub)', fontSize: '0.78rem', lineHeight: 1.4 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '1rem', padding: '1.25rem 1.5rem' }}>
          <h3 style={{ color: 'var(--gold)', marginBottom: '0.75rem', fontSize: '0.95rem', fontWeight: 700 }}>⚠️ Important Rules</h3>
          <ul style={{ color: 'var(--sub)', fontSize: '0.85rem', lineHeight: 2, paddingLeft: '1.25rem' }}>
            <li>ITSR Coins can only be spent inside ITS-R Universe</li>
            <li>No withdrawal — coins cannot be converted back to PKR</li>
            <li>Coins never expire as long as your account is active</li>
            <li>Rate: 100 PKR = 100 ITSR Coins (1:1) | Minimum: 100 PKR</li>
          </ul>
        </div>
      </div>

      <footer style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid var(--border)', color: 'var(--sub)', fontSize: '0.75rem', marginTop: '2rem' }}>
        ITS-R Bank | ITS-R Universe | In loving memory of Roshan Ali Sahab 🤲
      </footer>
    </div>
  )
}