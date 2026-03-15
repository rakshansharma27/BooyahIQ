import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import { Users, Crown, Shield, Copy, MessageSquare, BarChart2, Trophy } from 'lucide-react'
import { generateInviteUrl } from '@/lib/utils'

export default async function GuildPage({ params }: { params: Promise<{ guildId: string }> }) {
  const session = await getServerSession(authOptions)
  const { guildId } = await params

  const guild = await prisma.guild.findUnique({
    where: { id: guildId },
    include: {
      members: {
        include: {
          user: { select: { id: true, playerName: true, avatarUrl: true, uid: true, kdRatio: true, rank: true, isPremium: true } },
        },
        orderBy: [{ role: 'asc' }, { joinedAt: 'asc' }],
      },
    },
  })

  if (!guild) notFound()

  const isMember = session ? guild.members.some(m => m.userId === session.user.id) : false
  const currentMember = guild.members.find(m => m.userId === session?.user.id)
  const isLeader = currentMember?.role === 'LEADER'
  const inviteUrl = generateInviteUrl(guild.inviteCode)

  const avgKD = guild.members
    .filter(m => m.user.kdRatio)
    .reduce((acc, m) => acc + (m.user.kdRatio || 0), 0) / guild.members.filter(m => m.user.kdRatio).length || 0

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Guild Header */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#00ff88] to-[#0066ff] flex items-center justify-center text-3xl font-bold text-black flex-shrink-0">
              {guild.tag.slice(0, 2)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-rajdhani text-3xl font-bold text-white">{guild.name}</h1>
                <span className="bg-[#00ff88]/10 text-[#00ff88] text-sm px-2 py-0.5 rounded border border-[#00ff88]/20">
                  [{guild.tag}]
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-2">{guild.region} · Level {guild.level}</p>
              {guild.description && <p className="text-gray-300 text-sm">{guild.description}</p>}
            </div>
            <div className="flex gap-2 flex-wrap">
              {isMember && (
                <Link href={`/guild/${guild.id}/chat`} className="btn-primary text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Guild Chat
                </Link>
              )}
              {!isMember && session && (
                <Link href={`/guild/${guild.id}/join`} className="btn-primary text-sm">
                  Join Guild
                </Link>
              )}
            </div>
          </div>

          {/* Guild Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#1f2937]">
            {[
              { label: 'Members', value: guild.members.length },
              { label: 'Avg K/D', value: avgKD.toFixed(2) },
              { label: 'Region', value: guild.region },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-orbitron text-xl font-bold text-[#00ff88]">{stat.value}</div>
                <div className="text-gray-400 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Members */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="font-rajdhani text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#00ff88]" /> Members ({guild.members.length})
              </h2>
              <div className="space-y-2">
                {guild.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between bg-[#0d1117] rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00ff88] to-[#0066ff] flex items-center justify-center text-sm font-bold text-black">
                        {member.user.playerName?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm font-medium">{member.user.playerName}</span>
                          {member.user.isPremium && <Crown className="w-3 h-3 text-yellow-400" />}
                        </div>
                        <div className="text-gray-400 text-xs">{member.user.rank || 'Unranked'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-xs">{member.user.kdRatio?.toFixed(2) || '—'} K/D</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        member.role === 'LEADER' ? 'bg-yellow-500/20 text-yellow-400' :
                        member.role === 'OFFICER' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {member.role === 'LEADER' ? <Crown className="w-3 h-3 inline" /> : 
                         member.role === 'OFFICER' ? <Shield className="w-3 h-3 inline" /> : null}
                        {' '}{member.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Invite Link */}
            {isLeader && (
              <div className="card">
                <h3 className="font-rajdhani text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Copy className="w-4 h-4 text-[#00ff88]" /> Invite Link
                </h3>
                <div className="bg-[#0d1117] rounded-lg p-3 text-xs text-gray-400 break-all mb-2">
                  {inviteUrl}
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(inviteUrl)}
                  className="btn-secondary text-xs w-full"
                >
                  Copy Invite Link
                </button>
              </div>
            )}

            {/* Guild Analytics - Coming Soon */}
            <div className="card border-[#1f2937] relative overflow-hidden">
              <div className="absolute inset-0 bg-[#0d1117]/80 flex items-center justify-center z-10 rounded-xl">
                <div className="text-center">
                  <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <span className="text-yellow-400 font-bold text-sm">Coming Soon</span>
                  <p className="text-gray-400 text-xs mt-1">Guild Analytics</p>
                </div>
              </div>
              <h3 className="font-rajdhani text-lg font-bold text-white mb-3 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#00ff88]" /> Analytics
              </h3>
              <div className="space-y-2 opacity-30">
                <div className="h-3 bg-[#1f2937] rounded" />
                <div className="h-3 bg-[#1f2937] rounded w-3/4" />
                <div className="h-3 bg-[#1f2937] rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
