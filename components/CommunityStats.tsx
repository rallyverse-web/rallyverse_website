import AnimatedSection from '@/components/AnimatedSection'

interface StatsData {
  eventsHosted: number
  registrationsManaged: number
  activeMembers: number
  partnerOrgs: number
}

interface CommunityStatsProps {
  stats: StatsData
}

export default function CommunityStats({ stats }: CommunityStatsProps) {
  const statItems = [
    {
      value: `${stats.eventsHosted}+`,
      label: 'Events Hosted',
      desc: 'Tournaments and leagues organized',
    },
    {
      value: `${stats.registrationsManaged}+`,
      label: 'Registrations Managed',
      desc: 'Seamless player entries & checks',
    },
    {
      value: `${stats.activeMembers}+`,
      label: 'Community Members',
      desc: 'Active sports players in Bengaluru',
    },
    {
      value: `${stats.partnerOrgs}+`,
      label: 'Partner Organizations',
      desc: 'Academies, brands, & clubs',
    },
  ]

  return (
    <section className="py-16 border-t border-b" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {statItems.map((item, i) => (
            <AnimatedSection key={item.label} delay={i * 0.08}>
              <div 
                className="flex flex-col items-center text-center p-6 rounded-xl transition-all duration-300 group hover:translate-y-[-4px]"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div 
                  className="font-display text-[48px] md:text-[56px] leading-none mb-3 font-bold rally-gradient-text"
                  style={{
                    letterSpacing: '-1px',
                  }}
                >
                  {item.value}
                </div>
                <div 
                  className="font-display text-[15px] uppercase tracking-wider mb-2" 
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.label}
                </div>
                <p 
                  className="font-body text-xs" 
                  style={{ color: 'var(--text-muted)' }}
                >
                  {item.desc}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
