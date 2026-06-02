import { NextResponse } from 'next/server'
export async function GET() {
  const id = process.env.NAYAPAY_ID || ''
  const iban = process.env.NAYAPAY_IBAN || ''
  if (!id || !iban) return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  return NextResponse.json({
    name: 'Seengar Ali Sahab',
    nayapay_id: id,
    iban,
    account_title: 'Seengar Ali Sahab',
    bank: 'Nayapay',
    rate: '100 PKR = 100 ITSR Coins',
    minimum: 100,
    note: 'Send exact amount. Keep screenshot as proof.'
  })
}