'use client'

import { useState } from 'react'

export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <form
      className="mt-4 flex"
      onSubmit={(e) => {
        e.preventDefault()
        setSubmitted(true)
      }}
    >
      <input
        type="email"
        required
        placeholder={submitted ? 'You are in. See you out there!' : 'you@email.com'}
        aria-label="Email address"
        className="w-full rounded-l-lg border border-border bg-carbon px-4 py-3 text-sm text-text placeholder:text-muted focus:border-orange focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-r-lg bg-orange px-5 py-3 text-sm font-bold text-black transition-all hover:brightness-110"
      >
        Subscribe
      </button>
    </form>
  )
}
