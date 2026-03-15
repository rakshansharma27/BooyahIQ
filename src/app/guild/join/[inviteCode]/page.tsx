import { redirect, notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { Users } from 'lucide-react'

export default async function JoinGuildPage({ params }: { params: Promise<{ inviteCode: string }> }) {
  const session = await getServerSession(authOptions)
  const { inviteCode } = await params

  if (!session) {
    redirect(`/auth/login?next=/guild/join/${inviteCode}`)
  }

  const guild = await prisma.guild.findUnique({
    where: { inviteCode },
    include: { members: true, _count: { select: { members: true } } },
  })

  if (!guild) notFound()

  const isMember = guild.members.some(m => m.userId === session.user.id)

  if (isMember) {
    redirect(`/guild/${guild.id}`)
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="card text-center">
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#00ff88] to-[#0066ff] flex items-center justify-center text-3xl font-bold text-black mx-auto mb-6">
            {guild.tag.slice(0, 2)}
          </div>
          <h1 className="font-rajdhani text-2xl font-bold text-white mb-2">{guild.name}</h1>
          <p className="text-gray-400 text-sm mb-1">[{guild.tag}] · {guild.region}</p>
          <p className="text-gray-400 text-sm mb-6">
            <Users className="w-4 h-4 inline mr-1" /> {guild._count.members} members
          </p>
          {guild.description && (
            <p className="text-gray-300 text-sm mb-6">{guild.description}</p>
          )}
          <form action={async () => {
            'use server'
            const existing = await prisma.guildMember.findFirst({
              where: { userId: session.user.id },
            })
            if (!existing) {
              await prisma.guildMember.create({
                data: { userId: session.user.id, guildId: guild.id, role: 'MEMBER' },
              })
            }
            redirect(`/guild/${guild.id}`)
          }}>
            <button type="submit" className="btn-primary w-full py-3 text-lg">
              Join {guild.name}
            </button>
          </form>
          <p className="text-gray-400 text-sm mt-4">
            <Link href="/dashboard" className="text-[#00ff88] hover:underline">Back to Dashboard</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
