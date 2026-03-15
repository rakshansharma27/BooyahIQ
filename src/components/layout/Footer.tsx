import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-[#1f2937] bg-[#080a0f] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="text-[#00ff88] w-5 h-5" />
              <span className="font-orbitron text-lg font-bold gradient-text">BooyahIQ</span>
            </div>
            <p className="text-gray-400 text-sm">
              Win Smarter. Play Harder. The ultimate Free Fire gaming intelligence platform.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-3 font-rajdhani">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/search" className="hover:text-white transition-colors">Player Search</Link></li>
              <li><Link href="/esports" className="hover:text-white transition-colors">Esports Hub</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 font-rajdhani">Coming Soon</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/meta" className="hover:text-white transition-colors">Meta Reports</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Guides & Blog</Link></li>
              <li><Link href="/sponsors" className="hover:text-white transition-colors">Sponsorships</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 font-rajdhani">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1f2937] mt-8 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>© 2024 BooyahIQ. All rights reserved.</p>
          <p>BooyahIQ is not affiliated with Garena or Free Fire.</p>
        </div>
      </div>
    </footer>
  )
}
