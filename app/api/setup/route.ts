import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const tables = ['itsr_bank_users','itsr_bank_wallets','itsr_coin_transactions','itsr_deposits','itsr_coin_stats']
  const results: Record<string, string> = {}
  for (const t of tables) {
    const { error } = await supabaseAdmin.from(t).select('id').limit(1)
    results[t] = error ? '❌ ' + error.message.substring(0,40) : '✅ exists'
  }
  return NextResponse.json({
    tables: results,
    note: 'Run the SQL in your Supabase dashboard to create missing tables',
    sql: `
CREATE TABLE IF NOT EXISTS itsr_bank_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
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
  wallet_id UUID, user_id UUID,
  type TEXT NOT NULL CHECK (type IN ('deposit','spend','earn','bonus','refund')),
  amount DECIMAL(20,4) NOT NULL,
  balance_after DECIMAL(20,4) NOT NULL,
  service_name TEXT, reference_id TEXT, description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS itsr_deposits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, wallet_id UUID,
  amount_pkr DECIMAL(12,2) NOT NULL,
  itsr_coins DECIMAL(20,4) NOT NULL,
  nayapay_ref TEXT, sender_name TEXT, sender_phone TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','rejected','processing')),
  admin_note TEXT, confirmed_at TIMESTAMPTZ,
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
INSERT INTO itsr_coin_stats (id) VALUES (1) ON CONFLICT (id) DO NOTHING;`
  })
}