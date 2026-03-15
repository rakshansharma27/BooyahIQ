'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { Settings, User, Crown, AlertCircle } from 'lucide-react'

const REGIONS = ['Asia', 'MENA', 'SA', 'Europe', 'Global']
const RANKS = ['Bronze', 'Silver', 'Gold I', 'Gold II', 'Gold III', 'Platinum I', 'Platinum II', 'Platinum III', 'Diamond I', 'Diamond II', 'Diamond III', 'Heroic', 'Grandmaster']

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [form, setForm] = useState({
    playerName: '', uid: '', rank: '', region: 'Asia',
    kdRatio: '', winRate: '', totalMatches: '', totalWins: '', totalKills: '',
    favoriteCharacter: '', favoriteWeapon: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login')
    if (session) fetchProfile()
  }, [status, session, router])

  const fetchProfile = async () => {
    const res = await fetch('/api/profile')
    if (res.ok) {
      const data = await res.json()
      setForm({
        playerName: data.playerName || '',
        uid: data.uid || '',
        rank: data.rank || '',
        region: data.region || 'Asia',
        kdRatio: data.kdRatio?.toString() || '',
        winRate: data.winRate ? (data.winRate * 100).toString() : '',
        totalMatches: data.totalMatches?.toString() || '',
        totalWins: data.totalWins?.toString() || '',
        totalKills: data.totalKills?.toString() || '',
        favoriteCharacter: data.favoriteCharacter || '',
        favoriteWeapon: data.favoriteWeapon || '',
      })
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        winRate: form.winRate ? parseFloat(form.winRate) / 100 : undefined,
      }),
    })

    if (res.ok) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } else {
      setMessage({ type: 'error', text: 'Update failed. Try again.' })
    }
    setLoading(false)
  }

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingScreenshot(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'screenshot')

    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()

    if (res.ok && data.stats) {
      const stats = data.stats
      setForm(prev => ({
        ...prev,
        ...(stats.playerName && { playerName: stats.playerName }),
        ...(stats.uid && { uid: stats.uid }),
        ...(stats.rank && { rank: stats.rank }),
        ...(stats.kdRatio !== undefined && { kdRatio: stats.kdRatio.toString() }),
        ...(stats.winRate !== undefined && { winRate: (stats.winRate * 100).toString() }),
        ...(stats.totalMatches !== undefined && { totalMatches: stats.totalMatches.toString() }),
        ...(stats.totalKills !== undefined && { totalKills: stats.totalKills.toString() }),
        ...(stats.favoriteCharacter && { favoriteCharacter: stats.favoriteCharacter }),
        ...(stats.favoriteWeapon && { favoriteWeapon: stats.favoriteWeapon }),
      }))
      setMessage({ type: 'success', text: 'Screenshot processed! Stats extracted and filled in.' })
    } else {
      setMessage({ type: 'error', text: 'Screenshot processing failed. Please fill in manually.' })
    }
    setUploadingScreenshot(false)
  }

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-7 h-7 text-[#00ff88]" />
          <h1 className="font-rajdhani text-3xl font-bold text-white">Settings</h1>
        </div>

        {message && (
          <div className={`mb-6 px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            <AlertCircle className="w-4 h-4" />
            {message.text}
          </div>
        )}

        {/* Screenshot Upload */}
        <div className="card mb-6">
          <h2 className="font-rajdhani text-xl font-bold text-white mb-3 flex items-center gap-2">
            📸 Auto-fill from Screenshot
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Upload your Free Fire profile screenshot and AI will extract your stats automatically.
          </p>
          <label className="btn-secondary cursor-pointer inline-block">
            {uploadingScreenshot ? '⏳ Processing...' : '📤 Upload Screenshot'}
            <input
              type="file"
              accept="image/*"
              onChange={handleScreenshotUpload}
              className="hidden"
              disabled={uploadingScreenshot}
            />
          </label>
        </div>

        {/* Profile Form */}
        <div className="card">
          <h2 className="font-rajdhani text-xl font-bold text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-[#00ff88]" /> Player Profile
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Player Name</label>
                <input type="text" value={form.playerName}
                  onChange={e => setForm({...form, playerName: e.target.value})}
                  className="input" placeholder="In-game name" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">UID</label>
                <input type="text" value={form.uid}
                  onChange={e => setForm({...form, uid: e.target.value})}
                  className="input" placeholder="Free Fire UID" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Rank</label>
                <select value={form.rank} onChange={e => setForm({...form, rank: e.target.value})} className="input">
                  <option value="">Select rank</option>
                  {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Region</label>
                <select value={form.region} onChange={e => setForm({...form, region: e.target.value})} className="input">
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">K/D Ratio</label>
                <input type="number" step="0.01" value={form.kdRatio}
                  onChange={e => setForm({...form, kdRatio: e.target.value})}
                  className="input" placeholder="e.g. 3.5" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Win Rate (%)</label>
                <input type="number" step="0.1" min="0" max="100" value={form.winRate}
                  onChange={e => setForm({...form, winRate: e.target.value})}
                  className="input" placeholder="e.g. 15.5" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Total Matches</label>
                <input type="number" value={form.totalMatches}
                  onChange={e => setForm({...form, totalMatches: e.target.value})}
                  className="input" placeholder="e.g. 500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Total Wins</label>
                <input type="number" value={form.totalWins}
                  onChange={e => setForm({...form, totalWins: e.target.value})}
                  className="input" placeholder="e.g. 75" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Total Kills</label>
                <input type="number" value={form.totalKills}
                  onChange={e => setForm({...form, totalKills: e.target.value})}
                  className="input" placeholder="e.g. 1500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Favorite Character</label>
                <input type="text" value={form.favoriteCharacter}
                  onChange={e => setForm({...form, favoriteCharacter: e.target.value})}
                  className="input" placeholder="e.g. Chrono" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Favorite Weapon</label>
                <input type="text" value={form.favoriteWeapon}
                  onChange={e => setForm({...form, favoriteWeapon: e.target.value})}
                  className="input" placeholder="e.g. M1014" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Subscription */}
        <div className="card mt-6">
          <h2 className="font-rajdhani text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-400" /> Subscription
          </h2>
          {session?.user.isPremium ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium flex items-center gap-2">
                  <Crown className="w-4 h-4 text-yellow-400" /> Premium Active
                </div>
                <div className="text-gray-400 text-sm mt-1">Contact support to cancel</div>
              </div>
              <span className="badge-premium">Active</span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Free Plan</div>
                <div className="text-gray-400 text-sm mt-1">Upgrade for zero ads and unlimited features</div>
              </div>
              <a href="/pricing" className="btn-primary text-sm">Upgrade</a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
