import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Admin: confirm a deposit → credit coins to wallet
export async function POST(req: NextRequest) {
  try {
    const { deposit_id, admin_key } = await req.json()
    if (admin_key !== process.env.ADMIN_SECRET_KEY) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    const { data: deposit } = await supabaseAdmin.from('itsr_deposits').select('*').eq('id', deposit_id).single()
    if (!deposit) return NextResponse.json({ error: 'Deposit not found' }, { status: 404 })
    if (deposit.status !== 'pending') return NextResponse.json({ error: 'Already processed' }, { status: 400 })
    // Update deposit status
    await supabaseAdmin.from('itsr_deposits').update({ status: 'confirmed', confirmed_at: new Date().toISOString() }).eq('id', deposit_id)
    // Credit wallet
    if (deposit.user_id) {
      let { data: wallet } = await supabaseAdmin.from('itsr_bank_wallets').select('*').eq('user_id', deposit.user_id).single()
      if (!wallet) {
        const { data: nw } = await supabaseAdmin.from('itsr_bank_wallets').insert({ user_id: deposit.user_id, balance: 0 }).select().single()
        wallet = nw
      }
      const newBalance = Number(wallet.balance) + Number(deposit.itsr_coins)
      await supabaseAdmin.from('itsr_bank_wallets').update({ balance: newBalance, total_deposited: Number(wallet.total_deposited) + Number(deposit.itsr_coins), updated_at: new Date().toISOString() }).eq('id', wallet.id)
      await supabaseAdmin.from('itsr_coin_transactions').insert({ wallet_id: wallet.id, user_id: deposit.user_id, type: 'deposit', amount: deposit.itsr_coins, balance_after: newBalance, description: `Deposit via Nayapay — Ref: ${deposit.nayapay_ref}`, service_name: 'ITS-R Bank' })
      // Update global stats
      await supabaseAdmin.from('itsr_coin_stats').update({ circulating_supply: supabaseAdmin.rpc('increment', { x: deposit.itsr_coins }), total_pkr_deposited: supabaseAdmin.rpc('increment', { x: deposit.amount_pkr }) }).eq('id', 1)
    }
    return NextResponse.json({ ok: true, message: `${deposit.itsr_coins} ITSR Coins credited` })
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

// Get pending deposits
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const admin_key = searchParams.get('admin_key')
  if (admin_key !== process.env.ADMIN_SECRET_KEY) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const { data: deposits } = await supabaseAdmin.from('itsr_deposits').select('*').eq('status','pending').order('created_at', { ascending: false })
  return NextResponse.json({ deposits: deposits || [] })
}