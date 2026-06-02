import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { amount_pkr, itsr_coins, nayapay_ref, sender_name, sender_phone, user_id } = body
    if (!amount_pkr || amount_pkr < 100) return NextResponse.json({ error: 'Minimum deposit is 100 PKR' }, { status: 400 })
    if (!nayapay_ref) return NextResponse.json({ error: 'Nayapay reference required' }, { status: 400 })
    if (!sender_name) return NextResponse.json({ error: 'Sender name required' }, { status: 400 })
    const { data: deposit, error } = await supabaseAdmin.from('itsr_deposits').insert({
      user_id: user_id || null, amount_pkr, itsr_coins: itsr_coins || Math.floor(amount_pkr),
      nayapay_ref, sender_name, sender_phone, status: 'pending'
    }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, deposit })
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}