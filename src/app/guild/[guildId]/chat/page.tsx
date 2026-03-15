import { GuildChatClient } from './GuildChatClient'

export default async function GuildChatPage({ params }: { params: Promise<{ guildId: string }> }) {
  const { guildId } = await params
  return <GuildChatClient guildId={guildId} />
}
