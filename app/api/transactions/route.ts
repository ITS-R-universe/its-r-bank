import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id') || req.nextUrl.searchParams.get('user_id')
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { data: transactions } = await supabaseAdmin.from('itsr_coin_transactions')
    .select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50)
  return NextResponse.json({ transactions: transactions || [] })
}