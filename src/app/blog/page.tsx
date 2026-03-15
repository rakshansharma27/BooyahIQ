import ComingSoon from '@/components/ComingSoon'

export default function BlogPage() {
  return (
    <ComingSoon
      title="Guides & Blog"
      description="In-depth guides, tips, and strategies written by top Free Fire players to help you climb the ranks."
      icon="📝"
      page="blog"
      features={[
        'Beginner to Pro guides',
        'Character combo guides',
        'Landing spot strategies',
        'Team communication tips',
        'Ranked mode climbing guides',
        'Community highlights',
      ]}
    />
  )
}
