'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X } from 'lucide-react'
import GradientText from '@/components/GradientText'
import Magnet from '@/components/Magnet'
import ShinyText from '@/components/ShinyText'

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Events', href: '#events' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

const sectionIds = ['hero', 'about', 'events', 'faq', 'contact']

export default function Navbar() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [isMobile, setIsMobile] = useState(false)

  // Scroll background toggle
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const updateViewportState = () => setIsMobile(window.innerWidth < 768)

    updateViewportState()
    window.addEventListener('resize', updateViewportState)
    return () => window.removeEventListener('resize', updateViewportState)
  }, [])

  // IntersectionObserver for active section tracking
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    const sectionMap = new Map<string, number>()

    const pickActive = () => {
      let best = 'hero'
      let bestRatio = -1
      sectionMap.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          bestRatio = ratio
          best = id
        }
      })
      setActiveSection(best)
    }

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          sectionMap.set(id, entry.intersectionRatio)
          pickActive()
        },
        { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    setActiveSection(href.replace('#', ''))
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 h-16 transition-all duration-300 ${
          scrolled
            ? 'border-b border-white/10 bg-[#0B0D10] backdrop-blur-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="relative flex h-full items-center justify-between px-6 md:px-12">
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNavClick('#hero')}
            className="flex shrink-0 items-center gap-2"
          >
            <Image
              src="/logo/logo_transparent.png"
              alt="RallyVerse logo"
              width={120}
              height={40}
              className="h-8 w-auto object-contain"
              priority
            />
            <span className="hidden font-display text-lg leading-none tracking-tight sm:inline-flex">
              <span className="text-white">RALLY</span>
              <GradientText
                colors={['#FF5E00', '#FF8C00', '#00C9A7', '#00E5FF', '#FF5E00']}
                animationSpeed={6}
                showBorder={false}
                className="font-display tracking-tight"
              >
                VERSE
              </GradientText>
            </span>
          </button>

          {/* Desktop nav links */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '')
              return (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => handleNavClick(link.href)}
                  className={`relative text-sm font-medium tracking-wide transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-[#909090] hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#FF5E00] rounded-full" />
                  )}
                </button>
              )
            })}
          </nav>

          {/* Desktop Register button */}
          <div className="hidden shrink-0 md:block">
            <Magnet padding={30} disabled={isMobile}>
              <button
                type="button"
                onClick={() => router.push('/register')}
                className="whitespace-nowrap rounded-md bg-brand-gradient px-4 py-2 text-sm font-semibold text-carbon transition-all duration-200 hover:glow-orange active:scale-95"
              >
                <ShinyText
                  text="Register Now"
                  disabled={false}
                  speed={3}
                  className="text-sm font-semibold"
                  shineColor="rgba(255,255,255,0.6)"
                />
              </button>
            </Magnet>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-primary p-1"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#13161B] px-6 pb-8 pt-5"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between mb-8">
                <button
                  type="button"
                  onClick={() => handleNavClick('#hero')}
                  className="flex items-center gap-2"
                >
                  <Image
                    src="/logo/logo_transparent.png"
                    alt="RallyVerse logo"
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain"
                  />
                  <span className="inline-flex font-display text-lg leading-none tracking-tight">
                    <span className="text-white">RALLY</span>
                    <GradientText
                      colors={['#FF5E00', '#FF8C00', '#00C9A7', '#00E5FF', '#FF5E00']}
                      animationSpeed={6}
                      showBorder={false}
                      className="font-display tracking-tight"
                    >
                      VERSE
                    </GradientText>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="text-primary p-1"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Drawer nav links */}
              <nav className="flex flex-col gap-1">
                {navLinks.map((link, i) => {
                  const isActive = activeSection === link.href.replace('#', '')
                  return (
                    <motion.button
                      key={link.href}
                      type="button"
                      onClick={() => handleNavClick(link.href)}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.2 }}
                      className={`w-full text-left py-3 px-2 text-base font-medium tracking-wide border-b border-white/5 transition-colors duration-200 ${
                        isActive
                          ? 'text-white border-l-2 border-l-[#FF5E00] pl-3'
                          : 'text-[#909090] hover:text-white'
                      }`}
                    >
                      {link.label}
                    </motion.button>
                  )
                })}
              </nav>

              {/* Drawer CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.2 }}
                className="mt-8"
              >
                <Magnet padding={30} disabled={isMobile}>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      router.push('/register')
                    }}
                    className="w-full rounded-md bg-brand-gradient py-3 text-sm font-semibold text-carbon transition-all duration-200 hover:glow-orange active:scale-95"
                  >
                    <ShinyText
                      text="Register Now"
                      disabled={false}
                      speed={3}
                      className="text-sm font-semibold"
                      shineColor="rgba(255,255,255,0.6)"
                    />
                  </button>
                </Magnet>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
