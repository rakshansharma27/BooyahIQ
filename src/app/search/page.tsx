'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Search, Crown } from 'lucide-react'

interface Player {
  id: string
  playerName: string
  uid: string | null
  rank: string | null
  kdRatio: number | null
  winRate: number | null
  region: string | null
  avatarUrl: string | null
  isPremium: boolean
  totalMatches: number | null
  totalKills: number | null
  guildMembers: Array<{ guild: { id: string; name: string; tag: string } }>
}

const REGIONS = ['ALL', 'Asia', 'MENA', 'SA', 'Europe']

export default function SearchPage() {
  const { data: session } = useSession()
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('ALL')
  const [results, setResults] = useState<Player[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)
  const [limitReached, setLimitReached] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || query.length < 2) return
    setError('')
    setLimitReached(false)
    setLoading(true)
    setSearched(true)

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&region=${region}`)
      const data = await res.json()

      if (!res.ok) {
        if (data.limitReached) {
          setLimitReached(true)
          setError(data.error)
        } else {
          setError(data.error || 'Search failed')
        }
        setResults([])
      } else {
        setResults(data)
      }
    } catch {
      setError('Search failed. Try again.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-rajdhani text-4xl font-bold text-white flex items-center justify-center gap-3 mb-2">
            <Search className="w-8 h-8 text-[#00ff88]" /> Player Search
          </h1>
          <p className="text-gray-400">Find Free Fire players by name or UID</p>
          {session && !session.user.isPremium && (
            <p className="text-yellow-400 text-sm mt-2">
              Free users: 10 searches/day ·{' '}
              <Link href="/pricing" className="underline hover:text-yellow-300">Upgrade for unlimited</Link>
            </p>
          )}
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-60">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input"
                placeholder="Player name or UID..."
                minLength={2}
              />
            </div>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="input w-36"
            >
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <button type="submit" disabled={loading || query.length < 2} className="btn-primary px-6 disabled:opacity-50">
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className={`mb-6 px-4 py-3 rounded-lg text-sm ${
            limitReached
              ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {error}
            {limitReached && (
              <Link href="/pricing" className="ml-2 underline font-medium">Upgrade to Premium →</Link>
            )}
          </div>
        )}

        {/* Results */}
        {searched && !error && (
          <div>
            <p className="text-gray-400 text-sm mb-4">{results.length} player{results.length !== 1 ? 's' : ''} found</p>
            {results.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No players found. Try a different search.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((player) => (
                  <div key={player.id} className="card hover:border-[#00ff88]/20 transition-all">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00ff88] to-[#0066ff] flex items-center justify-center text-lg font-bold text-black flex-shrink-0">
                          {player.playerName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Link href={`/player/${player.playerName}`} className="font-bold text-white hover:text-[#00ff88] transition-colors">
                              {player.playerName}
                            </Link>
                            {player.isPremium && <Crown className="w-4 h-4 text-yellow-400" />}
                          </div>
                          <div className="text-gray-400 text-xs">
                            UID: {player.uid || 'Hidden'} · {player.region}
                          </div>
                          {player.guildMembers[0]?.guild && (
                            <div className="text-[#00ff88] text-xs mt-0.5">
                              [{player.guildMembers[0].guild.tag}] {player.guildMembers[0].guild.name}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-center">
                        <div className="hidden sm:block">
                          <div className="font-bold text-[#00ff88]">{player.kdRatio?.toFixed(2) || '—'}</div>
                          <div className="text-gray-500 text-xs">K/D</div>
                        </div>
                        <div className="hidden sm:block">
                          <div className="font-bold text-yellow-400">
                            {player.winRate ? `${(player.winRate * 100).toFixed(1)}%` : '—'}
                          </div>
                          <div className="text-gray-500 text-xs">Win Rate</div>
                        </div>
                        <div className="hidden md:block">
                          <div className="font-bold text-white">{player.rank || '—'}</div>
                          <div className="text-gray-500 text-xs">Rank</div>
                        </div>
                        <Link href={`/player/${player.playerName}`} className="btn-secondary text-xs whitespace-nowrap">
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ad placeholder for free users */}
        {session && !session.user.isPremium && searched && results.length > 0 && (
          <div className="mt-6 border border-dashed border-[#1f2937] rounded-xl p-4 text-center text-gray-600 text-xs">
            Advertisement placeholder 728×90
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
