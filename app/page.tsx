import Hero from '@/components/hero'
import HeroIntro from '@/components/HeroIntro'
import CommunityStats from '@/components/CommunityStats'
import WhatWeDo from '@/components/WhatWeDo'
import EventCategories from '@/components/EventCategories'
import WhoThisIsFor from '@/components/WhoThisIsFor'
import CommunityProof from '@/components/CommunityProof'
import FirstEvent from '@/components/FirstEvent'
import FAQ from '@/components/FAQ'
import BelieversSection from '@/components/BelieversSection'
import ManifestoStrip from '@/components/ManifestoStrip'
import TrackPageView from '@/components/TrackPageView'
import { faqs } from '@/lib/faqs'
import { SITE } from '@/lib/config'
import { getFirstPublishedEvent } from '@/lib/repositories/events'
import { getCommunityStats } from '@/lib/repositories/stats'

export default async function Page() {
  const firstEvent = await getFirstPublishedEvent()
  const stats = await getCommunityStats()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": `${SITE.domain}#faq`,
            "mainEntity": faqs.map((faq) => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer,
              },
            })),
          }),
        }}
      />
      <TrackPageView pageType="homepage" />
      <Hero />
      <HeroIntro />
      <CommunityStats stats={stats} />
      <WhatWeDo />
      <EventCategories />
      <WhoThisIsFor />
      <CommunityProof />
      <FirstEvent event={firstEvent} />
      <BelieversSection />
      <FAQ />
      <ManifestoStrip />
    </>
  )
}
