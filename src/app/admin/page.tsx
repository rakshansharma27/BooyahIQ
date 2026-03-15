import ComingSoon from '@/components/ComingSoon'

export default function AdminPage() {
  return (
    <ComingSoon
      title="Admin Dashboard"
      description="A comprehensive admin panel to manage users, tournaments, guilds, and platform analytics."
      icon="⚙️"
      page="admin"
      features={[
        'User management',
        'Tournament management',
        'Revenue analytics',
        'Content moderation',
        'Platform monitoring',
      ]}
    />
  )
}
