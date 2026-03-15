import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { guildId: string } }) {
  const guild = await prisma.guild.findUnique({
    where: { id: params.guildId },
    include: {
      members: {
        include: { user: { select: { id: true, playerName: true, avatarUrl: true, uid: true, kdRatio: true, rank: true } } },
        orderBy: { role: 'asc' },
      },
      owner: { select: { playerName: true } },
    },
  })

  if (!guild) return NextResponse.json({ error: 'Guild not found' }, { status: 404 })

  return NextResponse.json(guild)
}

export async function PUT(req: NextRequest, { params }: { params: { guildId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const guild = await prisma.guild.findUnique({ where: { id: params.guildId } })
  if (!guild || guild.ownerId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { description, region } = await req.json()
  const updated = await prisma.guild.update({
    where: { id: params.guildId },
    data: { ...(description && { description }), ...(region && { region }) },
  })

  return NextResponse.json({ success: true, guild: updated })
}
