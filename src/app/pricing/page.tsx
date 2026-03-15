'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Crown, Check, Zap, AlertCircle } from 'lucide-react'

const FREE_FEATURES = [
  '10 player searches/day',
  'Basic player profile',
  'Guild membership',
  'Esports hub access',
  'Ad-supported experience',
]

const PREMIUM_FEATURES = [
  'Unlimited player searches',
  'Premium badge 👑',
  'Zero advertisements',
  'Priority support',
  'Daily meta updates (coming soon)',
  'Full guild analytics (coming soon)',
  'Early access to new features',
]

export default function PricingPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleRazorpay = async () => {
    if (!session) { window.location.href = '/auth/login'; return }
    setLoading('razorpay')

    try {
      const res = await fetch('/api/payments/razorpay', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      const RazorpayWindow = (window as Window & { Razorpay?: new (opts: Record<string, unknown>) => { open: () => void } }).Razorpay
      if (!RazorpayWindow) {
        // Load Razorpay script
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        document.body.appendChild(script)
        await new Promise(resolve => { script.onload = resolve })
      }

      const RazorpayConstructor = (window as Window & { Razorpay?: new (opts: Record<string, unknown>) => { open: () => void } }).Razorpay!
      const rzp = new RazorpayConstructor({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: data.orderId,
        amount: data.amount,
        currency: data.currency,
        name: 'BooyahIQ',
        description: 'Premium Monthly Subscription',
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const verifyRes = await fetch('/api/payments/webhook/razorpay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...response, userId: session.user.id }),
          })
          if (verifyRes.ok) {
            setMessage({ type: 'success', text: 'Payment successful! Premium activated. 👑' })
          } else {
            setMessage({ type: 'error', text: 'Payment verification failed. Contact support.' })
          }
        },
        prefill: { email: session.user.email || '' },
        theme: { color: '#00ff88' },
      })
      rzp.open()
    } catch {
      setMessage({ type: 'error', text: 'Payment failed. Try again.' })
    }

    setLoading(null)
  }

  const handleStripe = async () => {
    if (!session) { window.location.href = '/auth/login'; return }
    setLoading('stripe')

    try {
      const res = await fetch('/api/payments/stripe', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      if (data.url) window.location.href = data.url
    } catch {
      setMessage({ type: 'error', text: 'Payment failed. Try again.' })
    }

    setLoading(null)
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Crown className="w-14 h-14 text-yellow-400 mx-auto mb-4" />
          <h1 className="font-rajdhani text-4xl font-bold text-white mb-3">
            Simple, <span className="gradient-gold">Affordable</span> Pricing
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Start free and upgrade when you need more power. Cancel anytime.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-8 px-4 py-3 rounded-lg text-sm flex items-center gap-2 max-w-md mx-auto ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {message.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free */}
          <div className="card">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-[#00ff88]" />
              <h2 className="font-rajdhani text-2xl font-bold text-white">Free</h2>
            </div>
            <div className="font-orbitron text-4xl font-bold text-white mb-1">₹0</div>
            <p className="text-gray-400 text-sm mb-6">Forever free</p>
            <ul className="space-y-2 mb-8">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-center gap-2 text-gray-300 text-sm">
                  <Check className="w-4 h-4 text-[#00ff88] flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            {session ? (
              <div className="btn-secondary w-full text-center py-3 opacity-50 cursor-not-allowed">
                Current Plan
              </div>
            ) : (
              <Link href="/auth/register" className="btn-secondary w-full text-center py-3 block">
                Get Started Free
              </Link>
            )}
          </div>

          {/* Premium */}
          <div className="card border-[#ffd700]/30 bg-gradient-to-br from-[#ffd700]/5 to-transparent relative overflow-hidden">
            <div className="absolute top-3 right-3 bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full border border-yellow-500/30">
              Most Popular
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              <h2 className="font-rajdhani text-2xl font-bold text-white">Premium</h2>
            </div>
            <div className="flex items-end gap-2 mb-1">
              <span className="font-orbitron text-4xl font-bold text-yellow-400">₹99</span>
              <span className="text-gray-400 text-sm mb-1">/month</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">~$1.99/month international</p>
            <ul className="space-y-2 mb-8">
              {PREMIUM_FEATURES.map(f => (
                <li key={f} className="flex items-center gap-2 text-gray-300 text-sm">
                  <Crown className="w-4 h-4 text-yellow-400 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>

            {session?.user.isPremium ? (
              <div className="text-center py-3 text-yellow-400 font-bold flex items-center justify-center gap-2">
                <Crown className="w-5 h-5" /> Premium Active
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleRazorpay}
                  disabled={loading === 'razorpay'}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold py-3 rounded-lg hover:from-yellow-400 hover:to-yellow-300 transition-all disabled:opacity-50"
                >
                  {loading === 'razorpay' ? 'Loading...' : '₹99/month (India — Razorpay)'}
                </button>
                <button
                  onClick={handleStripe}
                  disabled={loading === 'stripe'}
                  className="w-full btn-secondary py-3 disabled:opacity-50"
                >
                  {loading === 'stripe' ? 'Loading...' : '$1.99/month (International — Stripe)'}
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Cancel anytime · Secure payment · No hidden fees
        </p>
      </div>
      <Footer />
    </div>
  )
}
