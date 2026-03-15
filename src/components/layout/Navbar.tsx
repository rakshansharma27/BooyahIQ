'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Menu, X, Crown, Zap } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 glass border-b border-[#1f2937]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Zap className="text-[#00ff88] w-6 h-6" />
            <span className="font-orbitron text-xl font-bold gradient-text">BooyahIQ</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/esports" className="text-gray-400 hover:text-white transition-colors text-sm">
              Esports
            </Link>
            <Link href="/search" className="text-gray-400 hover:text-white transition-colors text-sm">
              Player Search
            </Link>
            <Link href="/meta" className="text-gray-400 hover:text-white transition-colors text-sm">
              Meta
            </Link>
            <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">
              Pricing
            </Link>
            
            {session ? (
              <div className="flex items-center gap-4">
                {session.user.isPremium && (
                  <Crown className="w-5 h-5 text-yellow-400" />
                )}
                <Link href="/dashboard" className="btn-primary text-sm">
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login" className="btn-secondary text-sm">
                  Login
                </Link>
                <Link href="/auth/register" className="btn-primary text-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0d1117] border-t border-[#1f2937] px-4 py-4 space-y-3">
          <Link href="/esports" className="block text-gray-300 hover:text-white py-2">Esports</Link>
          <Link href="/search" className="block text-gray-300 hover:text-white py-2">Player Search</Link>
          <Link href="/meta" className="block text-gray-300 hover:text-white py-2">Meta</Link>
          <Link href="/pricing" className="block text-gray-300 hover:text-white py-2">Pricing</Link>
          {session ? (
            <>
              <Link href="/dashboard" className="block btn-primary text-center">Dashboard</Link>
              <button onClick={() => signOut()} className="block w-full text-gray-400 py-2 text-left">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="block btn-secondary text-center">Login</Link>
              <Link href="/auth/register" className="block btn-primary text-center">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
