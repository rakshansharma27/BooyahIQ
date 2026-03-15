import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { pusherServer } from '@/lib/pusher'

export async function GET(req: NextRequest, { params }: { params: { guildId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const channel = searchParams.get('channel') || 'general'

  const messages = await prisma.chatMessage.findMany({
    where: { guildId: params.guildId, channel },
    include: {
      user: { select: { playerName: true, avatarUrl: true, isPremium: true } },
    },
    orderBy: { createdAt: 'asc' },
    take: 100,
  })

  return NextResponse.json(messages)
}

export async function POST(req: NextRequest, { params }: { params: { guildId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content, channel = 'general' } = await req.json()

  if (!content?.trim()) {
    return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 })
  }

  // Verify membership
  const member = await prisma.guildMember.findFirst({
    where: { userId: session.user.id, guildId: params.guildId },
  })
  if (!member) return NextResponse.json({ error: 'Not a guild member' }, { status: 403 })

  const message = await prisma.chatMessage.create({
    data: {
      content: content.trim(),
      channel,
      userId: session.user.id,
      guildId: params.guildId,
    },
    include: {
      user: { select: { playerName: true, avatarUrl: true, isPremium: true } },
    },
  })

  // Broadcast via Pusher
  await pusherServer.trigger(
    `guild-${params.guildId}-${channel}`,
    'new-message',
    message
  )

  return NextResponse.json(message)
}
