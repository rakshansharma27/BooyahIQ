import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: { guildId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const member = await prisma.guildMember.findFirst({
    where: { userId: session.user.id, guildId: params.guildId },
  })

  if (!member) return NextResponse.json({ error: 'Not a member' }, { status: 404 })
  if (member.role === 'LEADER') {
    return NextResponse.json({ error: 'Transfer leadership first' }, { status: 400 })
  }

  await prisma.guildMember.delete({ where: { id: member.id } })

  return NextResponse.json({ success: true })
}
