import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: { guildId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await prisma.guildMember.findFirst({ where: { userId: session.user.id } })
  if (existing) {
    return NextResponse.json({ error: 'Already in a guild' }, { status: 409 })
  }

  const guild = await prisma.guild.findUnique({ where: { id: params.guildId } })
  if (!guild) return NextResponse.json({ error: 'Guild not found' }, { status: 404 })

  await prisma.guildMember.create({
    data: { userId: session.user.id, guildId: params.guildId, role: 'MEMBER' },
  })

  return NextResponse.json({ success: true })
}
