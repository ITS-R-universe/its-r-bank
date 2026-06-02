import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id') || req.nextUrl.searchParams.get('user_id')
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  let { data: wallet } = await supabaseAdmin.from('itsr_bank_wallets').select('*').eq('user_id', userId).single()
  if (!wallet) {
    const { data: newWallet } = await supabaseAdmin.from('itsr_bank_wallets')
      .insert({ user_id: userId, balance: 0, total_deposited: 0, total_spent: 0, total_earned: 0 })
      .select().single()
    wallet = newWallet
  }
  return NextResponse.json({ wallet })
}