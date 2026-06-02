import Hero from '@/components/hero'
import HeroIntro from '@/components/HeroIntro'
import WhatWeDo from '@/components/WhatWeDo'
import EventCategories from '@/components/EventCategories'
import WhoThisIsFor from '@/components/WhoThisIsFor'
import CommunityProof from '@/components/CommunityProof'
import FirstEvent from '@/components/FirstEvent'
import FAQ from '@/components/FAQ'
import BelieversSection from '@/components/BelieversSection'
import ManifestoStrip from '@/components/ManifestoStrip'
import { faqs } from '@/lib/faqs'
import { SITE } from '@/lib/config'

export default function Page() {
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
      <Hero />
      <HeroIntro />
      <WhatWeDo />
      <EventCategories />
      <WhoThisIsFor />
      <CommunityProof />
      <FirstEvent />
      <BelieversSection />
      <FAQ />
      <ManifestoStrip />
    </>
  )
}
