'use client'
import { useState, useEffect } from 'react'
export default function DepositPage() {
  const [dark, setDark] = useState(true)
  const [form, setForm] = useState({ amount_pkr: '', nayapay_ref: '', sender_name: '', sender_phone: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    const t = localStorage.getItem('its-r-theme')
    if (t === 'light') { setDark(false); document.documentElement.setAttribute('data-theme','light') }
  }, [])
  const toggleTheme = () => {
    const next = !dark; setDark(next)
    if (next) { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('its-r-theme','dark') }
    else { document.documentElement.setAttribute('data-theme','light'); localStorage.setItem('its-r-theme','light') }
  }
  const coins = form.amount_pkr ? Math.floor(Number(form.amount_pkr)) : 0
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    if (Number(form.amount_pkr) < 100) { setError('Minimum deposit is 100 PKR'); setLoading(false); return }
    try {
      const r = await fetch('/api/deposit', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({...form, amount_pkr: Number(form.amount_pkr), itsr_coins: coins }) })
      const d = await r.json()
      if (!r.ok) { setError(d.error||'Failed'); return }
      setSuccess(true)
    } catch { setError('Something went wrong') }
    finally { setLoading(false) }
  }
  const inp = { width:'100%',padding:'0.75rem 1rem',background:'var(--input-bg)',border:'1px solid var(--border)',borderRadius:'0.5rem',color:'var(--text)',fontSize:'0.9rem',outline:'none' }
  if (success) return (
    <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'system-ui,sans-serif'}}>
      <div style={{textAlign:'center',maxWidth:400}}>
        <div style={{fontSize:'3rem',marginBottom:'1rem'}}>✅</div>
        <h2 style={{color:'var(--text)',marginBottom:'0.5rem'}}>Deposit Request Submitted!</h2>
        <p style={{color:'var(--sub)',marginBottom:'0.5rem'}}>Your request for {coins} ITSR Coins is pending confirmation.</p>
        <p style={{color:'var(--sub)',fontSize:'0.875rem',marginBottom:'1.5rem'}}>You'll receive coins once the founder confirms your Nayapay payment.</p>
        <a href="/wallet" style={{color:'var(--gold)'}}>Go to Wallet →</a>
      </div>
    </div>
  )
  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',color:'var(--text)',fontFamily:'system-ui,sans-serif'}}>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 2rem',borderBottom:'1px solid var(--border)'}}>
        <a href="/" style={{color:'var(--gold)',fontWeight:800}}>🏦 ITS-R Bank</a>
        <button onClick={toggleTheme} style={{background:'var(--card)',border:'1px solid var(--border)',color:'var(--text)',padding:'0.4rem 0.75rem',borderRadius:'0.5rem',cursor:'pointer',fontSize:'0.8rem'}}>{dark?'☀️ Day':'🌙 Night'}</button>
      </nav>
      <div style={{maxWidth:600,margin:'0 auto',padding:'2rem 1.5rem'}}>
        <h1 style={{fontSize:'1.75rem',fontWeight:800,marginBottom:'0.5rem'}}>Deposit PKR 📥</h1>
        <p style={{color:'var(--sub)',marginBottom:'2rem'}}>Send PKR via Nayapay and earn ITSR Coins</p>
        <div style={{background:'var(--gold)',borderRadius:'1rem',padding:'1.5rem',marginBottom:'2rem',color:'#000'}}>
          <h3 style={{fontWeight:800,marginBottom:'0.75rem'}}>📱 Nayapay Account</h3>
          <p style={{fontWeight:700,fontSize:'1.1rem',marginBottom:'0.25rem'}}>Seengar Ali Sahab</p>
          <p style={{fontSize:'0.9rem',opacity:0.8}}>Send to this account and enter reference below</p>
          <div style={{marginTop:'0.75rem',background:'#00000022',borderRadius:'0.5rem',padding:'0.75rem',fontSize:'0.875rem'}}>
            ⚠️ Rate: 100 PKR = 100 ITSR Coins (1:1) | Minimum: 100 PKR
          </div>
        </div>
        <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'1rem',padding:'2rem'}}>
          {error && <div style={{background:'#ef444422',border:'1px solid #ef4444',color:'#ef4444',borderRadius:'0.5rem',padding:'0.75rem',marginBottom:'1rem',fontSize:'0.875rem'}}>{error}</div>}
          {coins > 0 && <div style={{background:'#22c55e22',border:'1px solid var(--success)',borderRadius:'0.5rem',padding:'0.875rem',marginBottom:'1rem',textAlign:'center'}}>
            <span style={{color:'var(--success)',fontWeight:700}}>You will receive: {new Intl.NumberFormat().format(coins)} ITSR Coins 🪙</span>
          </div>}
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            {[
              ['Amount (PKR)','number','amount_pkr','100',true],
              ['Nayapay Reference No.','text','nayapay_ref','TXN123456',true],
              ['Your Name','text','sender_name','Full name',true],
              ['Your Phone (optional)','tel','sender_phone','03XX-XXXXXXX',false],
            ].map(([label,type,key,ph,req])=>(
              <div key={key as string}>
                <label style={{display:'block',fontSize:'0.8rem',color:'var(--sub)',marginBottom:'0.375rem'}}>{label as string}</label>
                <input type={type as string} required={req as boolean} value={form[key as keyof typeof form]} onChange={e=>setForm(f=>({...f,[key as string]:e.target.value}))} placeholder={ph as string} style={inp} />
              </div>
            ))}
            <button type="submit" disabled={loading} style={{width:'100%',padding:'0.875rem',background:'var(--gold)',color:'#000',fontWeight:700,border:'none',borderRadius:'0.5rem',cursor:loading?'not-allowed':'pointer',opacity:loading?0.7:1,fontSize:'1rem'}}>
              {loading?'Submitting...':'Submit Deposit Request'}
            </button>
          </form>
        </div>
      </div>
      <footer style={{textAlign:'center',padding:'2rem',borderTop:'1px solid var(--border)',color:'var(--sub)',fontSize:'0.8rem',marginTop:'2rem'}}>
        ITS-R Universe | In loving memory of Roshan Ali Sahab 🤲
      </footer>
    </div>
  )
}