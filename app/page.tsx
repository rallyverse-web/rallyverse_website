'use client'

import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import WhatWeDo from '@/components/WhatWeDo'
import EventCategories from '@/components/EventCategories'
import FirstEvent from '@/components/FirstEvent'
import ManifestoStrip from '@/components/ManifestoStrip'
import Footer from '@/components/Footer'

export default function Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      <WhatWeDo />
      <EventCategories />
      <FirstEvent />
      <ManifestoStrip />
      <Footer />
    </main>
  )
}
