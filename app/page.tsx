'use client'
import { useState, useEffect } from 'react'
export default function BankHome() {
  const [dark, setDark] = useState(true)
  const toggleTheme = () => {
    const next = !dark; setDark(next)
    if (next) { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('its-r-theme','dark') }
    else { document.documentElement.setAttribute('data-theme','light'); localStorage.setItem('its-r-theme','light') }
  }
  useEffect(() => {
    const t = localStorage.getItem('its-r-theme')
    if (t === 'light') { setDark(false); document.documentElement.setAttribute('data-theme','light') }
  }, [])

  const s = { card: { background:'var(--card)',border:'1px solid var(--border)',borderRadius:'1rem',padding:'1.5rem' } }
  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',color:'var(--text)',fontFamily:'system-ui,sans-serif'}}>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 2rem',borderBottom:'1px solid var(--border)'}}>
        <span style={{color:'var(--gold)',fontWeight:800,fontSize:'1.1rem'}}>🏦 ITS-R Bank</span>
        <div style={{display:'flex',gap:'1rem',alignItems:'center'}}>
          <a href="/wallet" style={{color:'var(--text)',fontSize:'0.9rem'}}>My Wallet</a>
          <a href="/deposit" style={{color:'var(--text)',fontSize:'0.9rem'}}>Deposit</a>
          <button onClick={toggleTheme} style={{background:'var(--card)',border:'1px solid var(--border)',color:'var(--text)',padding:'0.4rem 0.75rem',borderRadius:'0.5rem',cursor:'pointer',fontSize:'0.8rem'}}>{dark?'☀️ Day':'🌙 Night'}</button>
        </div>
      </nav>
      <div style={{maxWidth:900,margin:'0 auto',padding:'3rem 1.5rem'}}>
        <div style={{textAlign:'center',marginBottom:'3rem'}}>
          <div style={{fontSize:'4rem',marginBottom:'1rem'}}>🏦</div>
          <h1 style={{fontSize:'2.5rem',fontWeight:800,marginBottom:'0.75rem'}}>ITS-R Bank</h1>
          <p style={{color:'var(--sub)',fontSize:'1.1rem',maxWidth:500,margin:'0 auto'}}>Internal wallet of ITS-R Universe. Deposit PKR via Nayapay, earn ITSR Coins, spend on 2,213 services.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:'1.5rem',marginBottom:'3rem'}}>
          {[
            {icon:'💳',title:'Your Wallet',desc:'Check balance, transaction history, and spending power',href:'/wallet'},
            {icon:'📥',title:'Deposit PKR',desc:'Send via Nayapay. 100 PKR = 100 ITSR Coins. Instant credit after confirmation.',href:'/deposit'},
            {icon:'💰',title:'ITSR Coins',desc:'1 Trillion total supply. Coins never expire. Spend on any ITS-R service.',href:'https://its-r-coin.vercel.app'},
          ].map(item=>(
            <a key={item.title} href={item.href} style={{...s.card,display:'block',textDecoration:'none',transition:'border-color 0.2s'}}>
              <div style={{fontSize:'2rem',marginBottom:'0.75rem'}}>{item.icon}</div>
              <h3 style={{color:'var(--text)',marginBottom:'0.5rem',fontSize:'1.1rem'}}>{item.title}</h3>
              <p style={{color:'var(--sub)',fontSize:'0.875rem',lineHeight:1.5}}>{item.desc}</p>
            </a>
          ))}
        </div>
        <div style={{...s.card,marginBottom:'2rem'}}>
          <h2 style={{fontSize:'1.25rem',fontWeight:700,marginBottom:'1.5rem',color:'var(--gold)'}}>💸 How to Deposit</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1rem'}}>
            {[
              {step:'1',title:'Send via Nayapay',desc:'Send PKR to founder's Nayapay account'},
              {step:'2',title:'Submit Request',desc:'Fill deposit form with Nayapay reference number'},
              {step:'3',title:'Admin Confirms',desc:'Founder verifies and confirms the payment'},
              {step:'4',title:'Coins Credited',desc:'ITSR Coins added to your wallet instantly'},
            ].map(s=>(
              <div key={s.step} style={{textAlign:'center',padding:'1rem'}}>
                <div style={{width:40,height:40,borderRadius:'50%',background:'var(--gold)',color:'#000',fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 0.75rem',fontSize:'1.1rem'}}>{s.step}</div>
                <h4 style={{marginBottom:'0.375rem',fontSize:'0.9rem'}}>{s.title}</h4>
                <p style={{color:'var(--sub)',fontSize:'0.8rem'}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{...s.card,background:'#d4af3711',borderColor:'var(--gold)'}}>
          <div style={{display:'flex',gap:'1rem',alignItems:'flex-start'}}>
            <div style={{fontSize:'1.5rem'}}>⚠️</div>
            <div>
              <h3 style={{color:'var(--gold)',marginBottom:'0.5rem'}}>Important Rules</h3>
              <ul style={{color:'var(--sub)',fontSize:'0.875rem',lineHeight:2,paddingLeft:'1.25rem'}}>
                <li>ITSR Coins can only be spent inside ITS-R Universe</li>
                <li>No withdrawal — coins cannot be converted back to PKR</li>
                <li>Coins never expire as long as your account is active</li>
                <li>Rate: 100 PKR = 100 ITSR Coins (1:1)</li>
                <li>Minimum deposit: 100 PKR</li>
              </ul>
            </div>
          </div>
        </div>
        <a href="https://its-r-passport.vercel.app/login?redirect=https://its-r-bank.vercel.app/wallet" style={{display:'block',textAlign:'center',margin:'2rem auto 0',padding:'1rem 2rem',background:'var(--gold)',color:'#000',fontWeight:700,borderRadius:'0.75rem',fontSize:'1rem',maxWidth:300}}>🛂 Sign In with ITS-R Passport</a>
      </div>
      <footer style={{textAlign:'center',padding:'2rem',borderTop:'1px solid var(--border)',color:'var(--sub)',fontSize:'0.8rem',marginTop:'2rem'}}>
        ITS-R Bank | ITS-R Universe | In loving memory of Roshan Ali Sahab 🤲
      </footer>
    </div>
  )
}