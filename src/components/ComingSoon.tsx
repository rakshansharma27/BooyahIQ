'use client'

import { useState } from 'react'
import Navbar from './layout/Navbar'
import Footer from './layout/Footer'
import { Clock, Bell } from 'lucide-react'

interface ComingSoonProps {
  title: string
  description: string
  icon: React.ReactNode
  page: string
  features?: string[]
}

export default function ComingSoon({ title, description, icon, page, features }: ComingSoonProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, page }),
    })

    setSubmitted(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">{icon}</div>
        <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-1 text-yellow-400 text-sm mb-6">
          <Clock className="w-4 h-4" /> Coming Soon
        </div>
        <h1 className="font-rajdhani text-4xl font-bold text-white mb-4">{title}</h1>
        <p className="text-gray-400 mb-8">{description}</p>

        {features && features.length > 0 && (
          <div className="card mb-8 text-left">
            <h3 className="font-rajdhani text-lg font-bold text-white mb-3">What&apos;s coming:</h3>
            <ul className="space-y-2">
              {features.map(f => (
                <li key={f} className="flex items-center gap-2 text-gray-300 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input flex-1"
              placeholder="Get notified when it launches"
              required
            />
            <button type="submit" disabled={loading} className="btn-primary px-4 whitespace-nowrap disabled:opacity-50">
              <Bell className="w-4 h-4 inline mr-1" />
              {loading ? '...' : 'Notify Me'}
            </button>
          </form>
        ) : (
          <div className="bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-lg px-6 py-4 max-w-md mx-auto">
            <p className="text-[#00ff88] font-medium">
              ✓ You&apos;re on the list! We&apos;ll email you when {title} launches.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
