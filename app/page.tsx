'use client'

import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
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
