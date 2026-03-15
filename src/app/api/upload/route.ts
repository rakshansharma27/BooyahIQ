import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { uploadToCloudinaryServer } from '@/lib/cloudinary'
import { extractStatsFromScreenshot } from '@/lib/openai'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'avatar' | 'screenshot'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    const folder = type === 'avatar' ? 'booyahiq/avatars' : 'booyahiq/screenshots'
    const { url } = await uploadToCloudinaryServer(base64, folder)

    if (type === 'avatar') {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { avatarUrl: url },
      })
      return NextResponse.json({ success: true, url })
    }

    if (type === 'screenshot') {
      // Extract stats with OpenAI Vision
      const stats = await extractStatsFromScreenshot(url)

      if (Object.keys(stats).length > 0) {
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            ...(stats.playerName && { playerName: stats.playerName }),
            ...(stats.uid && { uid: stats.uid }),
            ...(stats.rank && { rank: stats.rank }),
            ...(stats.kdRatio !== undefined && { kdRatio: stats.kdRatio }),
            ...(stats.winRate !== undefined && { winRate: stats.winRate }),
            ...(stats.totalMatches !== undefined && { totalMatches: stats.totalMatches }),
            ...(stats.totalKills !== undefined && { totalKills: stats.totalKills }),
            ...(stats.favoriteCharacter && { favoriteCharacter: stats.favoriteCharacter }),
            ...(stats.favoriteWeapon && { favoriteWeapon: stats.favoriteWeapon }),
          },
        })
      }

      return NextResponse.json({ success: true, url, stats })
    }

    return NextResponse.json({ success: true, url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
