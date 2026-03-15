import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import { Crown, Shield, Users, Trophy, Search, Settings, Target, Swords, Star } from 'lucide-react'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      guildMembers: { include: { guild: true } },
      matches: { orderBy: { playedAt: 'desc' }, take: 5 },
    },
  })

  if (!user) redirect('/auth/login')

  const guild = user.guildMembers[0]?.guild

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00ff88] to-[#0066ff] flex items-center justify-center text-2xl font-bold text-black">
              {user.playerName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-rajdhani text-2xl font-bold text-white">{user.playerName || 'Player'}</h1>
                {user.isPremium && (
                  <span className="badge-premium flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Premium
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm">UID: {user.uid || 'Not set'} · {user.region}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href={`/player/${user.playerName}`} className="btn-secondary text-sm">
              View Public Profile
            </Link>
            <Link href="/settings" className="btn-secondary text-sm">
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'K/D Ratio', value: user.kdRatio?.toFixed(2) || '—', icon: Swords, color: 'text-[#00ff88]' },
            { label: 'Win Rate', value: user.winRate ? `${(user.winRate * 100).toFixed(1)}%` : '—', icon: Trophy, color: 'text-yellow-400' },
            { label: 'Total Matches', value: user.totalMatches || '—', icon: Target, color: 'text-blue-400' },
            { label: 'Total Kills', value: user.totalKills || '—', icon: Star, color: 'text-red-400' },
          ].map((stat) => (
            <div key={stat.label} className="card text-center">
              <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
              <div className="font-orbitron text-xl font-bold text-white">{stat.value}</div>
              <div className="text-gray-400 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="font-rajdhani text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#00ff88]" /> Player Stats
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Rank', value: user.rank || 'Not set' },
                  { label: 'Region', value: user.region || 'Asia' },
                  { label: 'Character', value: user.favoriteCharacter || 'Not set' },
                  { label: 'Weapon', value: user.favoriteWeapon || 'Not set' },
                  { label: 'Total Wins', value: user.totalWins || 0 },
                  { label: 'UID', value: user.uid || 'Not set' },
                ].map((item) => (
                  <div key={item.label} className="bg-[#0d1117] rounded-lg p-3">
                    <div className="text-gray-400 text-xs">{item.label}</div>
                    <div className="text-white font-semibold mt-1">{item.value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-3">
                <Link href="/settings" className="btn-primary text-sm flex-1 text-center">
                  Edit Profile
                </Link>
                <a
                  href={process.env.NEXT_PUBLIC_AFFILIATE_GARENA_URL || 'https://shop.garena.in'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-sm flex-1 text-center"
                >
                  💎 Top up Diamonds
                </a>
              </div>
            </div>

            {/* Recent Matches */}
            <div className="card">
              <h2 className="font-rajdhani text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#00ff88]" /> Recent Matches
              </h2>
              {user.matches.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No matches recorded yet</p>
              ) : (
                <div className="space-y-2">
                  {user.matches.map((match) => (
                    <div key={match.id} className="flex items-center justify-between bg-[#0d1117] rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${match.won ? 'bg-[#00ff88]' : 'bg-red-400'}`} />
                        <div>
                          <div className="text-white text-sm font-medium">{match.mode}</div>
                          <div className="text-gray-400 text-xs">#{match.placement} place</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white text-sm">{match.kills} kills</div>
                        <div className="text-gray-400 text-xs">{match.damage} dmg</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Guild */}
            <div className="card">
              <h2 className="font-rajdhani text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#00ff88]" /> My Guild
              </h2>
              {guild ? (
                <div>
                  <div className="font-bold text-white">{guild.name}</div>
                  <div className="text-gray-400 text-sm">[{guild.tag}] · {guild.region}</div>
                  <div className="flex gap-2 mt-3">
                    <Link href={`/guild/${guild.id}`} className="btn-primary text-xs flex-1 text-center">
                      View Guild
                    </Link>
                    <Link href={`/guild/${guild.id}/chat`} className="btn-secondary text-xs flex-1 text-center">
                      Chat
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-3">You&apos;re not in a guild</p>
                  <Link href="/guild/create" className="btn-primary text-sm inline-block">Create Guild</Link>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="card">
              <h2 className="font-rajdhani text-xl font-bold text-white mb-4">Quick Links</h2>
              <div className="space-y-2">
                {[
                  { href: '/esports', label: 'Esports Hub', icon: Trophy },
                  { href: '/search', label: 'Find Players', icon: Search },
                  { href: '/pricing', label: user.isPremium ? 'Manage Subscription' : 'Upgrade to Premium', icon: Crown },
                ].map((link) => (
                  <Link key={link.href} href={link.href} className="flex items-center gap-3 p-3 bg-[#0d1117] rounded-lg hover:bg-[#1a2332] transition-colors">
                    <link.icon className="w-4 h-4 text-[#00ff88]" />
                    <span className="text-white text-sm">{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Ad placeholder for free users */}
            {!user.isPremium && (
              <div className="border border-dashed border-[#1f2937] rounded-xl p-4 text-center">
                <div className="text-gray-500 text-xs">Advertisement</div>
                <div className="bg-[#0d1117] rounded-lg h-[250px] w-[300px] mx-auto mt-2 flex items-center justify-center text-gray-600 text-sm">
                  Ad placeholder 300×250
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
