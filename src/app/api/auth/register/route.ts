import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { sendEmail, getWelcomeEmail } from '@/lib/mailgun'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { email, password, playerName, uid } = await req.json()

    if (!email || !password || !playerName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, ...(uid ? [{ uid }] : [])] },
    })

    if (existing) {
      return NextResponse.json(
        { error: existing.email === email ? 'Email already registered' : 'UID already registered' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const emailVerifyToken = randomBytes(32).toString('hex')

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        playerName,
        uid: uid || null,
        emailVerifyToken,
      },
    })

    // Send welcome email (non-blocking)
    sendEmail({
      to: email,
      subject: 'Welcome to BooyahIQ! 🎮',
      html: getWelcomeEmail(playerName),
    }).catch(console.error)

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      userId: user.id,
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
