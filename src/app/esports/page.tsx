'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Trophy, Calendar, MapPin, ExternalLink, X } from 'lucide-react'

interface Tournament {
  id: string
  name: string
  status: string
  region: string
  prizePool: string | null
  date: string
  maxTeams: number
  currentTeams: number
  managerName: string | null
  managerEmail: string | null
  description: string | null
}

const STATUS_FILTERS = ['ALL', 'LIVE', 'UPCOMING', 'OPEN', 'COMPLETED']
const REGION_FILTERS = ['ALL', 'Asia', 'MENA', 'SA', 'Europe', 'Global']

const SEEDED_TOURNAMENTS: Tournament[] = [
  {
    id: '1', name: 'Free Fire World Series 2024', status: 'UPCOMING', region: 'Global',
    prizePool: '$2,000,000', date: new Date(Date.now() + 30 * 86400000).toISOString(),
    maxTeams: 24, currentTeams: 18, managerName: 'John Lee', managerEmail: 'manager@ffws.gg',
    description: 'The biggest Free Fire tournament of the year. Top teams from all regions compete.',
  },
  {
    id: '2', name: 'FFCS Asia Open', status: 'OPEN', region: 'Asia',
    prizePool: '$500,000', date: new Date(Date.now() + 14 * 86400000).toISOString(),
    maxTeams: 64, currentTeams: 41, managerName: 'Sarah Kim', managerEmail: 'sarah@ffcs.gg',
    description: 'Open qualifier for Free Fire Continental Series - Asia.',
  },
  {
    id: '3', name: 'MENA Championship', status: 'LIVE', region: 'MENA',
    prizePool: '$100,000', date: new Date().toISOString(),
    maxTeams: 16, currentTeams: 16, managerName: 'Ahmed Al-Rashid', managerEmail: 'ahmed@ffmena.gg',
    description: 'Live now! Top 16 MENA teams battling for the championship title.',
  },
  {
    id: '4', name: 'South Asia Pro League', status: 'UPCOMING', region: 'SA',
    prizePool: '$50,000', date: new Date(Date.now() + 7 * 86400000).toISOString(),
    maxTeams: 32, currentTeams: 20, managerName: 'Ravi Kumar', managerEmail: 'ravi@sapl.gg',
    description: 'Premier Free Fire league for South Asian teams.',
  },
  {
    id: '5', name: 'India Booyah Cup', status: 'OPEN', region: 'Asia',
    prizePool: '₹10,00,000', date: new Date(Date.now() + 21 * 86400000).toISOString(),
    maxTeams: 128, currentTeams: 67, managerName: 'Amit Singh', managerEmail: 'amit@ibcup.in',
    description: 'India\'s biggest Free Fire community tournament. Open for all Indian squads.',
  },
  {
    id: '6', name: 'FF Europe Clash', status: 'COMPLETED', region: 'Europe',
    prizePool: '€75,000', date: new Date(Date.now() - 7 * 86400000).toISOString(),
    maxTeams: 32, currentTeams: 32, managerName: 'Marc Dubois', managerEmail: 'marc@ffeurope.gg',
    description: 'European championship qualifier. Completed.',
  },
]

function StatusBadge({ status }: { status: string }) {
  const classes: Record<string, string> = {
    LIVE: 'status-live',
    UPCOMING: 'status-upcoming',
    OPEN: 'status-open',
    COMPLETED: 'status-completed',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${classes[status] || 'bg-gray-500/20 text-gray-400'}`}>
      {status === 'LIVE' && <span className="w-1.5 h-1.5 bg-red-400 rounded-full inline-block mr-1 animate-pulse" />}
      {status}
    </span>
  )
}

function ContactModal({ tournament, onClose }: { tournament: Tournament; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/tournaments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tournamentId: tournament.id, ...form }),
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="card max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        {sent ? (
          <div className="text-center py-4">
            <div className="text-[#00ff88] text-4xl mb-3">✓</div>
            <h3 className="font-rajdhani text-xl font-bold text-white mb-2">Message Sent!</h3>
            <p className="text-gray-400 text-sm">The tournament manager will contact you soon.</p>
            <button onClick={onClose} className="btn-primary mt-4">Close</button>
          </div>
        ) : (
          <>
            <h3 className="font-rajdhani text-xl font-bold text-white mb-1">Contact Manager</h3>
            <p className="text-gray-400 text-sm mb-4">{tournament.name}</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="input" placeholder="Your name" required />
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="input" placeholder="Your email" required />
              <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                className="input resize-none h-24" placeholder="Your message..." />
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default function EsportsPage() {
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [regionFilter, setRegionFilter] = useState('ALL')
  const [contactTournament, setContactTournament] = useState<Tournament | null>(null)
  const [tournaments, setTournaments] = useState<Tournament[]>(SEEDED_TOURNAMENTS)

  useEffect(() => {
    fetch(`/api/tournaments?status=${statusFilter}&region=${regionFilter}`)
      .then(r => r.json())
      .then(data => {
        if (data.length > 0) setTournaments(data)
      })
      .catch(() => {/* use seeded data */})
  }, [statusFilter, regionFilter])

  const filtered = tournaments.filter(t =>
    (statusFilter === 'ALL' || t.status === statusFilter) &&
    (regionFilter === 'ALL' || t.region === regionFilter)
  )

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-rajdhani text-4xl font-bold text-white flex items-center gap-3">
              <Trophy className="w-8 h-8 text-[#00ff88]" /> Esports Hub
            </h1>
            <p className="text-gray-400 mt-1">Find tournaments, contact managers, compete globally</p>
          </div>
          <a
            href={process.env.NEXT_PUBLIC_AFFILIATE_AMAZON_URL || 'https://www.amazon.in/gaming'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-sm flex items-center gap-2"
          >
            🎮 Gear Up Your Team <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  statusFilter === f
                    ? 'border-[#00ff88] bg-[#00ff88]/10 text-[#00ff88]'
                    : 'border-[#1f2937] text-gray-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {REGION_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setRegionFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  regionFilter === f
                    ? 'border-blue-400 bg-blue-400/10 text-blue-400'
                    : 'border-[#1f2937] text-gray-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Tournament Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t, i) => (
            <div key={t.id}>
              {/* Ad between cards for free users */}
              {i > 0 && i % 3 === 0 && (
                <div className="col-span-full border border-dashed border-[#1f2937] rounded-xl p-4 text-center text-gray-600 text-xs">
                  Advertisement placeholder 728×90
                </div>
              )}
              <div className="card hover:border-[#00ff88]/20 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <StatusBadge status={t.status} />
                  <span className="text-gray-400 text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {t.region}
                  </span>
                </div>
                <h3 className="font-rajdhani text-xl font-bold text-white mb-2">{t.name}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{t.description}</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-[#0d1117] rounded-lg p-2 text-center">
                    <div className="text-[#00ff88] font-bold text-sm">{t.prizePool || 'TBA'}</div>
                    <div className="text-gray-500 text-xs">Prize Pool</div>
                  </div>
                  <div className="bg-[#0d1117] rounded-lg p-2 text-center">
                    <div className="text-white font-bold text-sm">{t.currentTeams}/{t.maxTeams}</div>
                    <div className="text-gray-500 text-xs">Teams</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-4">
                  <Calendar className="w-3 h-3" />
                  {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div className="flex gap-2">
                  {t.status === 'LIVE' || t.status === 'UPCOMING' || t.status === 'OPEN' ? (
                    <button
                      onClick={() => setContactTournament(t)}
                      className="btn-primary text-xs flex-1"
                    >
                      Contact Manager
                    </button>
                  ) : (
                    <button disabled className="btn-secondary text-xs flex-1 opacity-50 cursor-not-allowed">
                      Completed
                    </button>
                  )}
                  {t.status === 'LIVE' && (
                    <span className="flex items-center gap-1 text-red-400 text-xs bg-red-500/10 border border-red-500/20 px-2 rounded-lg">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" /> LIVE
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            No tournaments found for the selected filters.
          </div>
        )}
      </div>
      <Footer />

      {contactTournament && (
        <ContactModal tournament={contactTournament} onClose={() => setContactTournament(null)} />
      )}
    </div>
  )
}
