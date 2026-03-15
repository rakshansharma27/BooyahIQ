import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { email, page } = await req.json()

    if (!email || !page) {
      return NextResponse.json({ error: 'Email and page required' }, { status: 400 })
    }

    await prisma.waitlistEmail.upsert({
      where: { email },
      create: { email, page },
      update: { page },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
