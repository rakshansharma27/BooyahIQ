'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { Send, Hash, Crown } from 'lucide-react'

const CHANNELS = [
  { id: 'general', label: '#general' },
  { id: 'strategy', label: '#strategy' },
  { id: 'recruitment', label: '#recruitment' },
  { id: 'tournaments', label: '#tournaments' },
]

interface Message {
  id: string
  content: string
  channel: string
  createdAt: string
  user: { playerName: string; avatarUrl: string | null; isPremium: boolean }
}

export default function GuildChatPage({ params }: { params: { guildId: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeChannel, setActiveChannel] = useState('general')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login')
  }, [status, router])

  useEffect(() => {
    fetchMessages()
    const cleanup = setupPusher()
    return () => { cleanup.then(fn => fn?.()) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChannel, params.guildId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async () => {
    const res = await fetch(`/api/chat/${params.guildId}?channel=${activeChannel}`)
    if (res.ok) {
      const data = await res.json()
      setMessages(data)
    }
  }

  const setupPusher = async () => {
    const { pusherClient } = await import('@/lib/pusher')
    const channelName = `guild-${params.guildId}-${activeChannel}`
    const channel = pusherClient.subscribe(channelName)
    channel.bind('new-message', (msg: Message) => {
      setMessages(prev => [...prev, msg])
    })
    return () => {
      pusherClient.unsubscribe(channelName)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || sending) return
    setSending(true)

    await fetch(`/api/chat/${params.guildId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: input, channel: activeChannel }),
    })

    setInput('')
    setSending(false)
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 py-4 gap-4">
        {/* Channels Sidebar */}
        <div className="w-48 flex-shrink-0">
          <div className="card h-full">
            <h3 className="font-rajdhani text-sm font-bold text-gray-400 uppercase mb-3">Channels</h3>
            <div className="space-y-1">
              {CHANNELS.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    activeChannel === ch.id
                      ? 'bg-[#00ff88]/10 text-[#00ff88]'
                      : 'text-gray-400 hover:text-white hover:bg-[#0d1117]'
                  }`}
                >
                  <Hash className="w-3 h-3" />
                  {ch.id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col card overflow-hidden min-h-[600px]">
          <div className="border-b border-[#1f2937] pb-3 mb-3">
            <h2 className="font-rajdhani text-lg font-bold text-white flex items-center gap-2">
              <Hash className="w-5 h-5 text-[#00ff88]" />
              {activeChannel}
            </h2>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-3" style={{ maxHeight: '500px' }}>
            {messages.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-8">
                No messages yet. Start the conversation!
              </p>
            )}
            {messages.map((msg, i) => (
              <div key={msg.id}>
                {/* Ad placeholder every 20 messages for free users */}
                {i > 0 && i % 20 === 0 && !session?.user.isPremium && (
                  <div className="border border-dashed border-[#1f2937] rounded-lg p-2 text-center text-gray-600 text-xs my-4">
                    Advertisement placeholder
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00ff88] to-[#0066ff] flex items-center justify-center text-xs font-bold text-black flex-shrink-0">
                    {msg.user.playerName?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-white text-sm font-medium">{msg.user.playerName}</span>
                      {msg.user.isPremium && <Crown className="w-3 h-3 text-yellow-400" />}
                      <span className="text-gray-500 text-xs">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input flex-1"
              placeholder={`Message #${activeChannel}`}
              maxLength={500}
            />
            <button type="submit" disabled={sending || !input.trim()} className="btn-primary px-4 disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
