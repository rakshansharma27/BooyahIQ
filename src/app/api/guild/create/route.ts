import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { name, tag, region, description } = await req.json()

    if (!name || !tag) {
      return NextResponse.json({ error: 'Name and tag required' }, { status: 400 })
    }

    // Check if user is already in a guild
    const existingMember = await prisma.guildMember.findFirst({
      where: { userId: session.user.id },
    })
    if (existingMember) {
      return NextResponse.json({ error: 'You are already in a guild. Leave first.' }, { status: 409 })
    }

    const guild = await prisma.guild.create({
      data: {
        name,
        tag: tag.toUpperCase().slice(0, 5),
        region: region || 'Asia',
        description,
        ownerId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: 'LEADER',
          },
        },
      },
    })

    return NextResponse.json({ success: true, guild })
  } catch (error) {
    if ((error as { code?: string })?.code === 'P2002') {
      return NextResponse.json({ error: 'Guild name already taken' }, { status: 409 })
    }
    console.error('Create guild error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
