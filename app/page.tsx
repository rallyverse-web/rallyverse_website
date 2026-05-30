import Hero from '@/components/hero'
import HeroIntro from '@/components/HeroIntro'
import WhatWeDo from '@/components/WhatWeDo'
import EventCategories from '@/components/EventCategories'
import WhoThisIsFor from '@/components/WhoThisIsFor'
import FirstEvent from '@/components/FirstEvent'
import FAQ from '@/components/FAQ'
import ManifestoStrip from '@/components/ManifestoStrip'

export default function Page() {
  return (
    <>
      <Hero />
      <HeroIntro />
      <WhatWeDo />
      <EventCategories />
      <WhoThisIsFor />
      <FirstEvent />
      <FAQ />
      <ManifestoStrip />
    </>
  )
}
