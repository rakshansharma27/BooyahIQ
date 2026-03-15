import ComingSoon from '@/components/ComingSoon'

export default function SponsorsPage() {
  return (
    <ComingSoon
      title="Sponsorships"
      description="Partner with BooyahIQ to reach 10,000+ passionate Free Fire players. Multiple sponsorship tiers available."
      icon="🤝"
      page="sponsors"
      features={[
        'Navbar brand placement',
        'Tournament card sponsorship',
        'Homepage featured sponsor',
        'Meta reports sponsor section',
        'Email newsletter sponsorship',
        'Custom campaign tracking',
      ]}
    />
  )
}
