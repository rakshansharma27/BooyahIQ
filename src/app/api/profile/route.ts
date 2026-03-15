import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, playerName: true, uid: true, email: true,
      rank: true, kdRatio: true, winRate: true, totalMatches: true,
      totalWins: true, totalKills: true, favoriteCharacter: true,
      favoriteWeapon: true, region: true, avatarUrl: true,
      isPremium: true, premiumExpiresAt: true,
    },
  })

  return NextResponse.json(user)
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { playerName, uid, rank, kdRatio, winRate, totalMatches, totalWins, totalKills,
    favoriteCharacter, favoriteWeapon, region } = body

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(playerName && { playerName }),
      ...(uid && { uid }),
      ...(rank && { rank }),
      ...(kdRatio !== undefined && { kdRatio: parseFloat(kdRatio) }),
      ...(winRate !== undefined && { winRate: parseFloat(winRate) }),
      ...(totalMatches !== undefined && { totalMatches: parseInt(totalMatches) }),
      ...(totalWins !== undefined && { totalWins: parseInt(totalWins) }),
      ...(totalKills !== undefined && { totalKills: parseInt(totalKills) }),
      ...(favoriteCharacter && { favoriteCharacter }),
      ...(favoriteWeapon && { favoriteWeapon }),
      ...(region && { region }),
    },
  })

  return NextResponse.json({ success: true, user })
}
