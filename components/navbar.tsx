'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X } from 'lucide-react'
import Magnet from '@/components/Magnet'
import ShinyText from '@/components/ShinyText'
import ThemedLogo from '@/components/ThemedLogo'
import ThemeToggle from '@/components/ThemeToggle'

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Events', href: '#events' },
  { label: 'Community', href: '#community' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

const sectionIds = ['hero', 'about', 'events', 'community', 'faq', 'contact']

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
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

  const handleNavClick = async (href: string) => {
    setMenuOpen(false)
    const sectionId = href.replace('#', '')
    setActiveSection(sectionId)

    if (pathname === '/') {
      const el = document.getElementById(sectionId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      return
    }

    // Navigate to homepage, then scroll to section once DOM is ready
    await router.push('/')
    await new Promise((resolve) => requestAnimationFrame(resolve))
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 h-16 no-theme-transition"
        style={{
          backgroundColor: scrolled ? 'var(--nav-bg-scrolled)' : 'transparent',
          borderBottom: scrolled ? '1px solid var(--nav-border)' : 'none',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
        }}
      >
        <div className="relative flex h-full items-center justify-between px-6 md:px-12">
          {/* Logo */}
          <button
            type="button"
            onClick={() => router.push('/')}
          >
            <ThemedLogo context="navbar" />
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
                  className="relative text-sm font-medium tracking-wide transition-colors duration-200"
                  style={{
                    color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full" style={{ backgroundColor: 'var(--accent-primary)' }} />
                  )}
                </button>
              )
            })}
          </nav>

          {/* Desktop right side */}
          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <ThemeToggle />
            <Magnet padding={30} disabled={isMobile}>
              <button
                type="button"
                onClick={() => router.push('/register')}
                className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-95"
                style={{
                  background: 'var(--gradient-brand)',
                  color: 'var(--btn-primary-text)',
                }}
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
            className="md:hidden p-1"
            style={{ color: 'var(--text-primary)' }}
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
              className="fixed inset-x-0 top-0 z-50 px-6 pb-8 pt-5"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderBottom: '1px solid var(--border-subtle)',
              }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between mb-8">
                <button
                  type="button"
                  onClick={() => router.push('/')}
                >
                  <ThemedLogo context="drawer" />
                </button>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="p-1"
                  style={{ color: 'var(--text-primary)' }}
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
                      className="w-full text-left py-3 px-2 text-base font-medium tracking-wide transition-colors duration-200"
                      style={{
                        color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                        borderBottom: '1px solid var(--border-subtle)',
                        borderLeft: isActive ? '2px solid var(--accent-primary)' : 'none',
                        paddingLeft: isActive ? '12px' : '8px',
                      }}
                      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-primary)'; }}
                      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                      {link.label}
                    </motion.button>
                  )
                })}
              </nav>

              {/* Drawer ThemeToggle */}
              <div className="px-2 pt-4 pb-2">
                <ThemeToggle />
              </div>

              {/* Drawer CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.2 }}
                className="mt-2"
              >
                <Magnet padding={30} disabled={isMobile}>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      router.push('/register')
                    }}
                    className="w-full rounded-md py-3 text-sm font-semibold transition-all duration-200 active:scale-95"
                    style={{
                      background: 'var(--gradient-brand)',
                      color: 'var(--btn-primary-text)',
                    }}
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
