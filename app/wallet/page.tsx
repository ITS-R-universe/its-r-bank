'use client'
import { useState, useEffect } from 'react'
type Txn = { id: string; type: string; amount: number; balance_after: number; description: string; service_name: string; created_at: string }
type Wallet = { balance: number; total_deposited: number; total_spent: number }
export default function WalletPage() {
  const [dark, setDark] = useState(true)
  const [wallet, setWallet] = useState<Wallet|null>(null)
  const [txns, setTxns] = useState<Txn[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = localStorage.getItem('its-r-theme')
    if (t === 'light') { setDark(false); document.documentElement.setAttribute('data-theme','light') }
    fetchData()
  }, [])
  const fetchData = async () => {
    try {
      const [wr, tr] = await Promise.all([fetch('/api/wallet'), fetch('/api/transactions')])
      const [w, t] = await Promise.all([wr.json(), tr.json()])
      if (w.wallet) setWallet(w.wallet)
      if (t.transactions) setTxns(t.transactions)
    } catch {}
    setLoading(false)
  }
  const toggleTheme = () => {
    const next = !dark; setDark(next)
    if (next) { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('its-r-theme','dark') }
    else { document.documentElement.setAttribute('data-theme','light'); localStorage.setItem('its-r-theme','light') }
  }
  const fmt = (n: number) => new Intl.NumberFormat('en-PK').format(n)
  const typeColor = (t: string) => t==='deposit'?'var(--success)':t==='spend'?'var(--error)':'var(--gold)'
  const typeIcon = (t: string) => t==='deposit'?'📥':t==='spend'?'💸':t==='earn'?'🎁':'✨'
  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',color:'var(--text)',fontFamily:'system-ui,sans-serif'}}>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 2rem',borderBottom:'1px solid var(--border)'}}>
        <a href="/" style={{color:'var(--gold)',fontWeight:800}}>🏦 ITS-R Bank</a>
        <div style={{display:'flex',gap:'1rem',alignItems:'center'}}>
          <a href="/deposit" style={{color:'var(--text)',fontSize:'0.9rem'}}>+ Deposit</a>
          <button onClick={toggleTheme} style={{background:'var(--card)',border:'1px solid var(--border)',color:'var(--text)',padding:'0.4rem 0.75rem',borderRadius:'0.5rem',cursor:'pointer',fontSize:'0.8rem'}}>{dark?'☀️':'🌙'}</button>
        </div>
      </nav>
      <div style={{maxWidth:800,margin:'0 auto',padding:'2rem 1.5rem'}}>
        <h1 style={{fontSize:'1.75rem',fontWeight:800,marginBottom:'2rem'}}>My Wallet 💳</h1>
        {loading ? (
          <div style={{textAlign:'center',color:'var(--sub)',padding:'3rem'}}>Loading...</div>
        ) : wallet ? (
          <>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1rem',marginBottom:'2rem'}}>
              {[
                {label:'ITSR Coin Balance',value:fmt(wallet.balance),icon:'🪙',gold:true},
                {label:'Total Deposited',value:fmt(wallet.total_deposited),icon:'📥'},
                {label:'Total Spent',value:fmt(wallet.total_spent),icon:'💸'},
              ].map(item=>(
                <div key={item.label} style={{background:'var(--card)',border:`1px solid ${item.gold?'var(--gold)':'var(--border)'}`,borderRadius:'1rem',padding:'1.5rem'}}>
                  <div style={{fontSize:'1.5rem',marginBottom:'0.5rem'}}>{item.icon}</div>
                  <div style={{fontSize:'1.75rem',fontWeight:800,color:item.gold?'var(--gold)':'var(--text)',marginBottom:'0.25rem'}}>{item.value}</div>
                  <div style={{color:'var(--sub)',fontSize:'0.8rem'}}>{item.label}</div>
                </div>
              ))}
            </div>
            <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'1rem',padding:'1.5rem'}}>
              <h2 style={{fontSize:'1.1rem',fontWeight:700,marginBottom:'1.5rem'}}>Transaction History</h2>
              {txns.length === 0 ? (
                <div style={{textAlign:'center',color:'var(--sub)',padding:'2rem'}}>No transactions yet. <a href="/deposit">Make your first deposit →</a></div>
              ) : txns.map(txn => (
                <div key={txn.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.875rem 0',borderBottom:'1px solid var(--border)'}}>
                  <div style={{display:'flex',gap:'0.75rem',alignItems:'center'}}>
                    <span style={{fontSize:'1.25rem'}}>{typeIcon(txn.type)}</span>
                    <div>
                      <div style={{fontSize:'0.9rem',fontWeight:600}}>{txn.description||txn.type}</div>
                      <div style={{color:'var(--sub)',fontSize:'0.75rem'}}>{txn.service_name||'ITS-R Bank'} • {new Date(txn.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontWeight:700,color:typeColor(txn.type)}}>{txn.type==='spend'?'-':'+'}{fmt(txn.amount)} ₡</div>
                    <div style={{color:'var(--sub)',fontSize:'0.75rem'}}>Bal: {fmt(txn.balance_after)}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{textAlign:'center',padding:'3rem'}}>
            <p style={{color:'var(--sub)',marginBottom:'1.5rem'}}>Sign in to view your wallet</p>
            <a href="https://its-r-passport.vercel.app/login?redirect=https://its-r-bank.vercel.app/wallet" style={{padding:'0.75rem 1.5rem',background:'var(--gold)',color:'#000',fontWeight:700,borderRadius:'0.5rem'}}>🛂 Sign In with ITS-R Passport</a>
          </div>
        )}
      </div>
      <footer style={{textAlign:'center',padding:'2rem',borderTop:'1px solid var(--border)',color:'var(--sub)',fontSize:'0.8rem',marginTop:'2rem'}}>
        ITS-R Universe | In loving memory of Roshan Ali Sahab 🤲
      </footer>
    </div>
  )
}