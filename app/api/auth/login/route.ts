import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { name, phone } = await req.json()
    if (!name || !phone) return NextResponse.json({ error: 'Name and phone required' }, { status: 400 })
    const cleanPhone = phone.replace(/[^0-9+]/g, '')

    let { data: user } = await supabaseAdmin
      .from('itsr_bank_users').select('*').eq('phone', cleanPhone).single()

    if (!user) {
      const { data: newUser, error } = await supabaseAdmin
        .from('itsr_bank_users')
        .insert({ name: name.trim(), phone: cleanPhone, is_active: true })
        .select().single()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      user = newUser
      await supabaseAdmin.from('itsr_bank_wallets')
        .insert({ user_id: user.id, balance: 0, total_deposited: 0, total_spent: 0, total_earned: 0 })
    } else {
      await supabaseAdmin.from('itsr_bank_users')
        .update({ name: name.trim(), last_login: new Date().toISOString() }).eq('id', user.id)
    }
    return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, phone: user.phone } })
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}