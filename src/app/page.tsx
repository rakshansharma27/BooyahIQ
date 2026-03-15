import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Zap, Shield, Users, Trophy, Search, Crown } from 'lucide-react'

export default function Home() {
  const features = [
    { icon: Shield, title: 'Player Stats', desc: 'Track K/D, win rate, ranks and match history with AI screenshot extraction.', href: '/dashboard' },
    { icon: Users, title: 'Guild System', desc: 'Create guilds, manage members, and communicate in real-time.', href: '/dashboard' },
    { icon: Trophy, title: 'Esports Hub', desc: 'Find tournaments, contact managers, and compete globally.', href: '/esports' },
    { icon: Search, title: 'Player Search', desc: 'Find players by name or UID with region filters.', href: '/search' },
    { icon: Zap, title: 'Meta Reports', desc: 'Stay ahead with weekly character & weapon meta analysis.', href: '/meta', comingSoon: true },
    { icon: Crown, title: 'Premium Badge', desc: 'Go premium at ₹99/month for zero ads and unlimited features.', href: '/pricing' },
  ]

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00ff88]/5 via-transparent to-[#0066ff]/5" />
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-full px-4 py-1 text-[#00ff88] text-sm mb-6">
            <Zap className="w-4 h-4" />
            Free Fire Gaming Intelligence
          </div>
          <h1 className="font-orbitron text-4xl md:text-6xl lg:text-7xl font-black mb-6">
            <span className="gradient-text">BOOYAH</span>
            <span className="text-white">IQ</span>
          </h1>
          <p className="text-xl md:text-2xl font-rajdhani text-gray-300 mb-4">
            Win Smarter. Play Harder.
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10">
            The ultimate Free Fire gaming intelligence platform. Track your stats, manage your guild, 
            dominate esports tournaments, and outsmart every opponent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn-primary text-lg px-8 py-3 inline-block text-center">
              Get Started Free →
            </Link>
            <Link href="/esports" className="btn-secondary text-lg px-8 py-3 inline-block text-center">
              View Tournaments
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-4">No credit card required · Free forever</p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#0d1117] border-y border-[#1f2937] py-6">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '10K+', label: 'Players' },
            { value: '500+', label: 'Guilds' },
            { value: '200+', label: 'Tournaments' },
            { value: '₹99', label: '/month Premium' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-orbitron text-2xl font-bold text-[#00ff88]">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="font-rajdhani text-3xl md:text-4xl font-bold text-white mb-4">
            Everything You Need to <span className="gradient-text">Dominate</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            From player analytics to guild management — all your Free Fire tools in one platform.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="card hover:border-[#00ff88]/30 transition-all duration-300 group relative"
            >
              {feature.comingSoon && (
                <span className="absolute top-4 right-4 bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full border border-yellow-500/30">
                  Coming Soon
                </span>
              )}
              <feature.icon className="w-10 h-10 text-[#00ff88] mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-rajdhani text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="card border-[#ffd700]/20 bg-gradient-to-br from-[#ffd700]/5 to-transparent">
          <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="font-rajdhani text-3xl font-bold mb-3">
            Go <span className="gradient-gold">Premium</span> for ₹99/month
          </h2>
          <p className="text-gray-400 mb-6">Zero ads, unlimited player searches, premium badge, and priority features.</p>
          <Link href="/pricing" className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold px-8 py-3 rounded-lg hover:from-yellow-400 hover:to-yellow-300 transition-all">
            Upgrade to Premium →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
