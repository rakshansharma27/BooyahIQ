import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Crown, Trophy, Target, Swords, Star, Shield } from 'lucide-react'

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const user = await prisma.user.findFirst({
    where: { playerName: { equals: username, mode: 'insensitive' } },
    include: {
      guildMembers: { include: { guild: true } },
      matches: { orderBy: { playedAt: 'desc' }, take: 10 },
    },
  })

  if (!user) notFound()

  const guild = user.guildMembers[0]?.guild

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Profile Header */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00ff88] to-[#0066ff] flex items-center justify-center text-3xl font-bold text-black flex-shrink-0">
              {user.playerName?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                <h1 className="font-rajdhani text-3xl font-bold text-white">{user.playerName}</h1>
                {user.isPremium && (
                  <span className="badge-premium flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Premium
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm mb-2">UID: {user.uid || 'Hidden'} · {user.region}</p>
              {guild && (
                <p className="text-[#00ff88] text-sm">[{guild.tag}] {guild.name}</p>
              )}
            </div>
            <a
              href={process.env.NEXT_PUBLIC_AFFILIATE_GARENA_URL || 'https://shop.garena.in'}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm whitespace-nowrap"
            >
              💎 Top up Diamonds
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'K/D Ratio', value: user.kdRatio?.toFixed(2) || '—', icon: Swords, color: 'text-[#00ff88]' },
            { label: 'Win Rate', value: user.winRate ? `${(user.winRate * 100).toFixed(1)}%` : '—', icon: Trophy, color: 'text-yellow-400' },
            { label: 'Matches', value: user.totalMatches || '—', icon: Target, color: 'text-blue-400' },
            { label: 'Kills', value: user.totalKills || '—', icon: Star, color: 'text-red-400' },
          ].map((stat) => (
            <div key={stat.label} className="card text-center">
              <stat.icon className={`w-7 h-7 ${stat.color} mx-auto mb-2`} />
              <div className="font-orbitron text-xl font-bold text-white">{stat.value}</div>
              <div className="text-gray-400 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="font-rajdhani text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#00ff88]" /> Player Details
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Rank', value: user.rank || 'Unknown' },
                { label: 'Region', value: user.region || 'Asia' },
                { label: 'Favorite Character', value: user.favoriteCharacter || 'Unknown' },
                { label: 'Favorite Weapon', value: user.favoriteWeapon || 'Unknown' },
                { label: 'Total Wins', value: user.totalWins || 0 },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-[#1f2937] last:border-0">
                  <span className="text-gray-400 text-sm">{item.label}</span>
                  <span className="text-white text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="font-rajdhani text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-[#00ff88]" /> Recent Matches
            </h2>
            {user.matches.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No matches yet</p>
            ) : (
              <div className="space-y-2">
                {user.matches.map((match) => (
                  <div key={match.id} className="flex items-center justify-between bg-[#0d1117] rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${match.won ? 'bg-[#00ff88]' : 'bg-red-400'}`} />
                      <div>
                        <div className="text-white text-sm font-medium">#{match.placement}</div>
                        <div className="text-gray-400 text-xs">{match.mode}</div>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <span className="text-white">{match.kills}K</span>
                      <span className="text-gray-400 ml-2">{match.damage}dmg</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
