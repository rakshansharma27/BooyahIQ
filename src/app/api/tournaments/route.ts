import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendEmail, getTournamentContactEmail } from '@/lib/mailgun'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const region = searchParams.get('region')

  const tournaments = await prisma.tournament.findMany({
    where: {
      ...(status && status !== 'ALL' ? { status } : {}),
      ...(region && region !== 'ALL' ? { region } : {}),
    },
    orderBy: { date: 'asc' },
  })

  return NextResponse.json(tournaments)
}

export async function POST(req: NextRequest) {

  try {
    const { tournamentId, name, email, message } = await req.json()

    if (!tournamentId || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } })
    if (!tournament) return NextResponse.json({ error: 'Tournament not found' }, { status: 404 })

    const contact = await prisma.tournamentContact.create({
      data: { tournamentId, name, email, message },
    })

    // Send email notification to manager
    if (tournament.managerEmail) {
      sendEmail({
        to: tournament.managerEmail,
        subject: `New inquiry for ${tournament.name}`,
        html: getTournamentContactEmail(tournament.name, name, email, message || ''),
      }).catch(console.error)
    }

    return NextResponse.json({ success: true, contact })
  } catch (error) {
    console.error('Tournament contact error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
