import Hero from '@/components/hero'
import WhatWeDo from '@/components/WhatWeDo'
import EventCategories from '@/components/EventCategories'
import WhoThisIsFor from '@/components/WhoThisIsFor'
import CommunityStats from '@/components/CommunityStats'
import FirstEvent from '@/components/FirstEvent'
import FAQ from '@/components/FAQ'
import ManifestoStrip from '@/components/ManifestoStrip'

export default function Page() {
  return (
    <>
      <Hero />
      <WhatWeDo />
      <EventCategories />
      <WhoThisIsFor />
      <CommunityStats />
      <FirstEvent />
      <FAQ />
      <ManifestoStrip />
    </>
  )
}
