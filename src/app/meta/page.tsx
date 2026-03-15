import ComingSoon from '@/components/ComingSoon'

export default function MetaPage() {
  return (
    <ComingSoon
      title="Meta Reports"
      description="Weekly character and weapon tier lists, patch analysis, and pro player strategies to dominate every Free Fire match."
      icon="📊"
      page="meta"
      features={[
        'Weekly character tier list (S/A/B/C rankings)',
        'Weapon meta analysis with stats',
        'Patch notes breakdown',
        'Pro player strategies',
        'Map rotations and hot drops',
        'Team composition guides',
      ]}
    />
  )
}
