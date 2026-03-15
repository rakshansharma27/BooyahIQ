import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import prisma from '@/lib/prisma'
import { sendEmail, getPaymentConfirmEmail } from '@/lib/mailgun'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,
  } = body

  // Verify signature
  const generatedSignature = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (generatedSignature !== razorpay_signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    await prisma.user.update({
      where: { id: userId },
      data: { isPremium: true, premiumExpiresAt: endDate },
    })

    await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        provider: 'razorpay',
        providerId: razorpay_payment_id,
        amount: 9900,
        currency: 'INR',
        startDate: new Date(),
        endDate,
      },
      update: {
        status: 'active',
        providerId: razorpay_payment_id,
        endDate,
      },
    })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user?.email) {
      sendEmail({
        to: user.email,
        subject: '👑 BooyahIQ Premium Activated!',
        html: getPaymentConfirmEmail(user.playerName || 'Player', 'Premium'),
      }).catch(console.error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Razorpay webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
