'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Zap className="text-[#00ff88] w-7 h-7" />
            <span className="font-orbitron text-2xl font-bold gradient-text">BooyahIQ</span>
          </Link>
          <h1 className="font-rajdhani text-3xl font-bold text-white">Forgot Password</h1>
          <p className="text-gray-400 mt-2">We&apos;ll send a reset link to your email</p>
        </div>

        <div className="card">
          {sent ? (
            <div className="text-center py-4">
              <div className="text-[#00ff88] text-5xl mb-4">✓</div>
              <h3 className="font-rajdhani text-xl font-bold text-white mb-2">Email Sent!</h3>
              <p className="text-gray-400 text-sm mb-6">
                If this email is registered, you&apos;ll receive a reset link shortly. Check your spam folder too.
              </p>
              <Link href="/auth/login" className="btn-primary">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="player@example.com"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <p className="text-center text-gray-400 text-sm">
                <Link href="/auth/login" className="text-[#00ff88] hover:underline">Back to Login</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
