import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/payments'
import prisma from '@/lib/prisma'
import { sendEmail, getPaymentConfirmEmail } from '@/lib/mailgun'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('stripe-signature') || ''

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as { metadata?: { userId?: string }; subscription?: string }
      const userId = session.metadata?.userId

      if (userId) {
        const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

        await prisma.user.update({
          where: { id: userId },
          data: { isPremium: true, premiumExpiresAt: endDate },
        })

        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            provider: 'stripe',
            providerId: session.subscription,
            amount: 199,
            currency: 'USD',
            startDate: new Date(),
            endDate,
          },
          update: {
            status: 'active',
            providerId: session.subscription,
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
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as { id: string }
      const sub = await prisma.subscription.findFirst({
        where: { providerId: subscription.id },
      })
      if (sub) {
        await prisma.user.update({
          where: { id: sub.userId },
          data: { isPremium: false },
        })
        await prisma.subscription.update({
          where: { id: sub.id },
          data: { status: 'cancelled', cancelledAt: new Date() },
        })
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
