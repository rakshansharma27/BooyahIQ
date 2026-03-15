'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import { Users } from 'lucide-react'

export default function CreateGuildPage() {
  const { status } = useSession()
  const router = useRouter()
  const [form, setForm] = useState({ name: '', tag: '', region: 'Asia', description: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (status === 'unauthenticated') {
    router.push('/auth/login')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/guild/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Failed to create guild')
      setLoading(false)
      return
    }

    router.push(`/guild/${data.guild.id}`)
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <Users className="w-12 h-12 text-[#00ff88] mx-auto mb-3" />
          <h1 className="font-rajdhani text-3xl font-bold text-white">Create Guild</h1>
          <p className="text-gray-400 mt-2">Build your Free Fire squad</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Guild Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
                placeholder="e.g. Shadow Warriors"
                required
                maxLength={30}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Tag * (max 5 chars)</label>
              <input
                type="text"
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value.toUpperCase().slice(0, 5) })}
                className="input"
                placeholder="e.g. SHDW"
                required
                maxLength={5}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Region</label>
              <select
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className="input"
              >
                {['Asia', 'MENA', 'SA', 'Europe', 'Global'].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input resize-none h-24"
                placeholder="Tell players about your guild..."
                maxLength={200}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Guild'}
            </button>

            <p className="text-center text-gray-400 text-sm">
              <Link href="/dashboard" className="text-[#00ff88] hover:underline">Cancel</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
