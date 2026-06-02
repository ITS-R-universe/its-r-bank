import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS itsr_bank_wallets (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL UNIQUE,
        balance DECIMAL(20,4) DEFAULT 0,
        total_deposited DECIMAL(20,4) DEFAULT 0,
        total_spent DECIMAL(20,4) DEFAULT 0,
        total_earned DECIMAL(20,4) DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS itsr_coin_transactions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        wallet_id UUID NOT NULL,
        user_id UUID NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('deposit','spend','earn','bonus','refund')),
        amount DECIMAL(20,4) NOT NULL,
        balance_after DECIMAL(20,4) NOT NULL,
        service_name TEXT,
        reference_id TEXT,
        description TEXT,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS itsr_deposits (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID,
        wallet_id UUID,
        amount_pkr DECIMAL(12,2) NOT NULL,
        itsr_coins DECIMAL(20,4) NOT NULL,
        nayapay_ref TEXT,
        sender_name TEXT,
        sender_phone TEXT,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','rejected','processing')),
        admin_note TEXT,
        confirmed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS itsr_coin_stats (
        id INTEGER DEFAULT 1 PRIMARY KEY CHECK (id = 1),
        total_supply DECIMAL(20,4) DEFAULT 1000000000000,
        circulating_supply DECIMAL(20,4) DEFAULT 0,
        total_holders INTEGER DEFAULT 0,
        total_transactions BIGINT DEFAULT 0,
        total_pkr_deposited DECIMAL(20,2) DEFAULT 0,
        rate_pkr_per_coin DECIMAL(10,4) DEFAULT 1.0,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      INSERT INTO itsr_coin_stats (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
    `
    // Use service role to execute setup via pg-compatible RPC
    const results = []
    for (const stmt of sql.split(';').map(s=>s.trim()).filter(Boolean)) {
      try {
        const { error } = await supabaseAdmin.rpc('exec_sql', { sql: stmt })
        results.push({ stmt: stmt.substring(0,50), error: error?.message })
      } catch (e: unknown) {
        results.push({ stmt: stmt.substring(0,50), error: String(e) })
      }
    }
    return NextResponse.json({ ok: true, results })
  } catch (error: unknown) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function GET() {
  // Check table existence
  const tables = ['itsr_bank_wallets','itsr_coin_transactions','itsr_deposits','itsr_coin_stats']
  const checks: Record<string, boolean> = {}
  for (const t of tables) {
    const { error } = await supabaseAdmin.from(t).select('id').limit(1)
    checks[t] = !error
  }
  return NextResponse.json({ tables: checks })
}