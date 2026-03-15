import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

const FREE_SEARCH_LIMIT = 10

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q') || ''
  const region = searchParams.get('region') || ''

  if (!query || query.length < 2) {
    return NextResponse.json({ error: 'Query too short' }, { status: 400 })
  }

  // Rate limit for free users
  if (session && !session.user.isPremium) {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Reset counter if it's a new day
    const now = new Date()
    const resetAt = new Date(user.searchesResetAt)
    const isNewDay = now.toDateString() !== resetAt.toDateString()

    if (isNewDay) {
      await prisma.user.update({
        where: { id: user.id },
        data: { searchesUsedToday: 0, searchesResetAt: now },
      })
    } else if (user.searchesUsedToday >= FREE_SEARCH_LIMIT) {
      return NextResponse.json({
        error: `Free users get ${FREE_SEARCH_LIMIT} searches/day. Upgrade to Premium for unlimited.`,
        limitReached: true,
      }, { status: 429 })
    }

    // Increment search counter
    await prisma.user.update({
      where: { id: user.id },
      data: { searchesUsedToday: { increment: 1 } },
    })
  }

  const users = await prisma.user.findMany({
    where: {
      AND: [
        {
          OR: [
            { playerName: { contains: query, mode: 'insensitive' } },
            { uid: { contains: query } },
          ],
        },
        ...(region && region !== 'ALL' ? [{ region }] : []),
      ],
    },
    select: {
      id: true, playerName: true, uid: true, rank: true, kdRatio: true,
      winRate: true, region: true, avatarUrl: true, isPremium: true,
      totalMatches: true, totalKills: true,
      guildMembers: {
        include: { guild: { select: { id: true, name: true, tag: true } } },
      },
    },
    take: 20,
  })

  return NextResponse.json(users)
}
