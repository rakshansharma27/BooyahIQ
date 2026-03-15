import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  try {
    const { type, url } = await req.json()

    await prisma.affiliateClick.create({
      data: {
        type,
        url,
        userId: session?.user.id || null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Affiliate click error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
