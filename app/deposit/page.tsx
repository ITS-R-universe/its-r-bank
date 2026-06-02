'use client'
import { useState, useEffect } from 'react'

type NayapayDetails = {
  name: string; nayapay_id: string; iban: string;
  account_title: string; rate: string; minimum: number; note: string
}

export default function DepositPage() {
  const [dark, setDark] = useState(true)
  const [nayapay, setNayapay] = useState<NayapayDetails | null>(null)
  const [copied, setCopied] = useState('')
  const [form, setForm] = useState({ amount_pkr: '', nayapay_ref: '', sender_name: '', sender_phone: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const t = localStorage.getItem('its-r-theme')
    if (t === 'light') { setDark(false); document.documentElement.setAttribute('data-theme', 'light') }
    const userStr = localStorage.getItem('its-r-user')
    if (userStr) {
      try {
        const u = JSON.parse(userStr)
        setForm(f => ({ ...f, sender_name: u.name || '', sender_phone: u.phone || '' }))
      } catch { /* ignore */ }
    }
    fetch('/api/nayapay').then(r => r.json()).then(d => { if (d.nayapay_id) setNayapay(d) })
  }, [])

  const toggleTheme = () => {
    const next = !dark; setDark(next)
    if (next) { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('its-r-theme', 'dark') }
    else { document.documentElement.setAttribute('data-theme', 'light'); localStorage.setItem('its-r-theme', 'light') }
  }

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(label); setTimeout(() => setCopied(''), 2000) })
  }

  const coins = form.amount_pkr ? Math.floor(Number(form.amount_pkr)) : 0
  const inp: React.CSSProperties = { width: '100%', padding: '0.75rem 1rem', background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    if (Number(form.amount_pkr) < 100) { setError('Minimum deposit is 100 PKR'); setLoading(false); return }
    if (!form.nayapay_ref.trim()) { setError('Transaction reference number required'); setLoading(false); return }
    if (!form.sender_name.trim()) { setError('Your name is required'); setLoading(false); return }
    if (!form.sender_phone.trim()) { setError('Your phone number is required'); setLoading(false); return }
    try {
      const userStr = localStorage.getItem('its-r-user')
      const user = userStr ? JSON.parse(userStr) : null
      const r = await fetch('/api/deposit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amount_pkr: Number(form.amount_pkr), itsr_coins: coins, user_id: user?.id })
      })
      const d = await r.json()
      if (!r.ok) { setError(d.error || 'Failed to submit'); return }
      setSuccess(true)
    } catch { setError('Something went wrong. Please try again.') }
    finally { setLoading(false) }
  }

  if (success) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui,sans-serif', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
        <h2 style={{ color: 'var(--text)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Request Submitted!</h2>
        <p style={{ color: 'var(--sub)', marginBottom: '0.5rem' }}>Your deposit request for <strong style={{ color: 'var(--gold)' }}>{coins} ITSR Coins</strong> is pending.</p>
        <p style={{ color: 'var(--sub)', fontSize: '0.875rem', marginBottom: '2rem' }}>Founder will verify your Nayapay payment and credit coins to your wallet.</p>
        <a href="/wallet" style={{ display: 'inline-block', padding: '0.875rem 2rem', background: 'var(--gold)', color: '#000', fontWeight: 700, borderRadius: '0.75rem', textDecoration: 'none' }}>
          Go to My Wallet →
        </a>
      </div>
    </div>
  )

  const copyBtn = (label: string, text: string): React.CSSProperties => ({
    marginLeft: '0.75rem', padding: '0.4rem 0.75rem',
    background: copied === label ? '#22c55e22' : 'var(--card)',
    border: `1px solid ${copied === label ? '#22c55e' : 'var(--border)'}`,
    color: copied === label ? '#22c55e' : 'var(--text)',
    borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.75rem',
    fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap'
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'system-ui,sans-serif' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderBottom: '1px solid var(--border)' }}>
        <a href="/" style={{ color: 'var(--gold)', fontWeight: 800, textDecoration: 'none' }}>🏦 ITS-R Bank</a>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a href="/wallet" style={{ color: 'var(--text)', fontSize: '0.9rem', textDecoration: 'none' }}>My Wallet</a>
          <button onClick={toggleTheme} style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}>
            {dark ? '☀️ Day' : '🌙 Night'}
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 620, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Deposit PKR 📥</h1>
        <p style={{ color: 'var(--sub)', marginBottom: '2rem' }}>Send PKR via Nayapay to earn ITSR Coins after confirmation</p>

        {/* STEP 1 */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gold)', color: '#000', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', flexShrink: 0 }}>1</div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Send Money via Nayapay</h2>
          </div>

          {nayapay ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: 'var(--input-bg)', borderRadius: '0.625rem', padding: '0.875rem 1rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--sub)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Account Title</div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{nayapay.account_title}</div>
              </div>

              <div style={{ background: 'var(--input-bg)', borderRadius: '0.625rem', padding: '0.875rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--sub)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Nayapay ID / Phone</div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: 'monospace', letterSpacing: '0.05em' }}>{nayapay.nayapay_id}</div>
                </div>
                <button onClick={() => copyText(nayapay.nayapay_id, 'id')} style={copyBtn('id', nayapay.nayapay_id)}>
                  {copied === 'id' ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>

              <div style={{ background: 'var(--input-bg)', borderRadius: '0.625rem', padding: '0.875rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--sub)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>IBAN</div>
                  <div style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.9rem', letterSpacing: '0.04em', wordBreak: 'break-all' }}>{nayapay.iban}</div>
                </div>
                <button onClick={() => copyText(nayapay.iban, 'iban')} style={copyBtn('iban', nayapay.iban)}>
                  {copied === 'iban' ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>

              <div style={{ background: '#d4af3711', border: '1px solid #d4af3744', borderRadius: '0.625rem', padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span>💡</span>
                <span style={{ fontSize: '0.85rem' }}>
                  <strong style={{ color: 'var(--gold)' }}>{nayapay.rate}</strong> &nbsp;|&nbsp; Min: ₨{nayapay.minimum} &nbsp;|&nbsp; {nayapay.note}
                </span>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--sub)', fontSize: '0.9rem' }}>Loading payment details...</div>
          )}
        </div>

        {/* STEP 2 */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '1rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gold)', color: '#000', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', flexShrink: 0 }}>2</div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Submit Your Transaction Details</h2>
          </div>

          {error && <div style={{ background: '#ef444422', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
          {coins > 0 && <div style={{ background: '#22c55e11', border: '1px solid #22c55e44', borderRadius: '0.5rem', padding: '0.875rem', marginBottom: '1rem', textAlign: 'center' }}>
            <span style={{ color: '#22c55e', fontWeight: 700 }}>You will receive: {new Intl.NumberFormat().format(coins)} ITSR Coins 🪙</span>
          </div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--sub)', marginBottom: '0.375rem' }}>Amount Sent (PKR) *</label>
              <input type="number" required min="100" value={form.amount_pkr} onChange={e => setForm(f => ({ ...f, amount_pkr: e.target.value }))} placeholder="e.g. 500" style={inp} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--sub)', marginBottom: '0.375rem' }}>Nayapay Transaction Reference / TXN ID *</label>
              <input type="text" required value={form.nayapay_ref} onChange={e => setForm(f => ({ ...f, nayapay_ref: e.target.value }))} placeholder="e.g. TXN2024XXXXXXXX" style={inp} />
              <p style={{ color: 'var(--sub)', fontSize: '0.75rem', marginTop: '0.25rem' }}>Found in Nayapay app → Transaction History</p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--sub)', marginBottom: '0.375rem' }}>Your Full Name *</label>
              <input type="text" required value={form.sender_name} onChange={e => setForm(f => ({ ...f, sender_name: e.target.value }))} placeholder="Your name" style={inp} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--sub)', marginBottom: '0.375rem' }}>Your Phone Number *</label>
              <input type="tel" required value={form.sender_phone} onChange={e => setForm(f => ({ ...f, sender_phone: e.target.value }))} placeholder="03XX-XXXXXXX" style={inp} />
            </div>
            <button type="submit" disabled={loading || !nayapay} style={{ width: '100%', padding: '0.9rem', background: 'var(--gold)', color: '#000', fontWeight: 700, border: 'none', borderRadius: '0.5rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading || !nayapay ? 0.7 : 1, fontSize: '1rem' }}>
              {loading ? 'Submitting...' : '📤 Submit Deposit Request'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--sub)', fontSize: '0.8rem', lineHeight: 1.8 }}>
          After submission, founder will verify your Nayapay payment and credit ITSR Coins.<br />
          This usually takes a few hours during working hours.
        </p>
      </div>

      <footer style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid var(--border)', color: 'var(--sub)', fontSize: '0.75rem', marginTop: '2rem' }}>
        ITS-R Bank | ITS-R Universe | In loving memory of Roshan Ali Sahab 🤲
      </footer>
    </div>
  )
}