import Image from 'next/image'
import { NewsletterForm } from './newsletter-form'

const eventLinks = ['Badminton', 'Treks', 'Marathons', 'Cycling']
const companyLinks = ['About', 'Community', 'RallyScore', 'Contact']

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface py-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <Image
                src="/rallyverse-logo.png"
                alt="RallyVerse logo"
                width={32}
                height={32}
                className="h-8 w-8 rounded-md object-contain"
              />
              <span className="font-display text-2xl font-extrabold uppercase leading-none">
                <span className="text-text">Rally</span>
                <span className="text-orange">Verse</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted">
              Where every event is a new verse.
            </p>
          </div>

          {/* Events */}
          <div>
            <h4 className="font-display text-base font-bold uppercase tracking-wide text-text">
              Events
            </h4>
            <ul className="mt-4 space-y-2.5">
              {eventLinks.map((l) => (
                <li key={l}>
                  <a
                    href="#events"
                    className="text-sm text-muted transition-colors hover:text-text"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display text-base font-bold uppercase tracking-wide text-text">
              Company
            </h4>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-sm text-muted transition-colors hover:text-text"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display text-base font-bold uppercase tracking-wide text-text">
              Join the Rally
            </h4>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-[13px] text-muted">
          © 2025 RallyVerse · Made in India
        </div>
      </div>
    </footer>
  )
}
