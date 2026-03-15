import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { razorpay, PREMIUM_PRICE_INR } from '@/lib/payments'

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const order = await razorpay.orders.create({
      amount: PREMIUM_PRICE_INR,
      currency: 'INR',
      receipt: `booyahiq_${session.user.id}_${Date.now()}`,
      notes: { userId: session.user.id },
    })

    return NextResponse.json({ orderId: order.id, amount: PREMIUM_PRICE_INR, currency: 'INR' })
  } catch (error) {
    console.error('Razorpay order error:', error)
    return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 })
  }
}
