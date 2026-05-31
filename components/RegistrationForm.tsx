'use client'

import { ChangeEvent, FormEvent, useMemo, useState } from 'react'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import AnimatedSection from '@/components/AnimatedSection'

type FormDataState = {
  category: string
  teamName: string
  player1Name: string
  player1Phone: string
  player1Email: string
  player1SkillLevel: string
  player2Name: string
  player2Phone: string
  player2Email: string
  player2SkillLevel: string
  city: string
  collegeOrOrg: string
  utrNumber: string
  paymentPhone: string
}

const categories = [
  "Men's Singles",
  "Women's Singles",
  "Men's Doubles",
  "Women's Doubles",
  'Mixed Doubles',
]

const skillLevels = ['Beginner', 'Intermediate', 'Advanced']
const phoneRegex = /^[+]?[0-9\s-]{10,15}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const utrRegex = /^[a-zA-Z0-9]{8,}$/

const inputBaseStyle = {
  width: '100%',
  minHeight: 48,
  backgroundColor: 'var(--input-bg)',
  color: 'var(--input-text)',
  fontFamily: 'var(--font-body)',
  fontSize: 14,
  padding: '12px 16px',
  borderRadius: 6,
  outline: 'none',
  border: '1px solid var(--input-border)',
  transition: 'border-color 0.2s, background-color 0.35s ease, color 0.35s ease',
} as React.CSSProperties

const inputClass =
  'w-full min-h-[48px] font-body text-sm px-4 py-3 rounded-md appearance-none cursor-pointer'

const selectClass = inputClass

const labelClass = 'mb-2 block font-body text-sm'
const errorClass = 'mt-2 font-body text-xs'

const initialFormData: FormDataState = {
  category: '',
  teamName: '',
  player1Name: '',
  player1Phone: '',
  player1Email: '',
  player1SkillLevel: '',
  player2Name: '',
  player2Phone: '',
  player2Email: '',
  player2SkillLevel: '',
  city: 'Bengaluru',
  collegeOrOrg: '',
  utrNumber: '',
  paymentPhone: '',
}

function isDoublesCategory(category: string) {
  return category.includes('Doubles')
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className={errorClass}>{message}</p>
}

export default function RegistrationForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormDataState>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState('')
  const [loadingMessage, setLoadingMessage] = useState('')
  const [registrationId, setRegistrationId] = useState('')

  const needsPlayer2 = useMemo(() => isDoublesCategory(formData.category), [formData.category])
  const upiId = process.env.NEXT_PUBLIC_UPI_ID || 'adityag,007@ptaxis'
  const entryFee = process.env.NEXT_PUBLIC_ENTRY_FEE || '800'
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+91 98765 43210'
  const whatsappGroupLink = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_LINK || 'https://chat.whatsapp.com/REPLACE_WITH_ACTUAL_LINK'

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const validateStep = (stepToValidate: number) => {
    const nextErrors: Record<string, string> = {}

    if (stepToValidate === 1) {
      if (!formData.category) nextErrors.category = 'Choose a category.'
    }

    if (stepToValidate === 2) {
      if (!formData.player1Name.trim()) nextErrors.player1Name = 'Player 1 name is required.'
      if (!phoneRegex.test(formData.player1Phone)) {
        nextErrors.player1Phone = 'Enter a valid WhatsApp number.'
      }
      if (formData.player1Email && !emailRegex.test(formData.player1Email)) {
        nextErrors.player1Email = 'Enter a valid email address.'
      }
      if (!formData.player1SkillLevel) nextErrors.player1SkillLevel = 'Choose Player 1 skill level.'
      if (!formData.city.trim()) nextErrors.city = 'City is required.'

      if (needsPlayer2) {
        if (!formData.player2Name.trim()) nextErrors.player2Name = 'Player 2 name is required.'
        if (!phoneRegex.test(formData.player2Phone)) {
          nextErrors.player2Phone = 'Enter a valid WhatsApp number.'
        }
        if (formData.player2Email && !emailRegex.test(formData.player2Email)) {
          nextErrors.player2Email = 'Enter a valid email address.'
        }
        if (!formData.player2SkillLevel) nextErrors.player2SkillLevel = 'Choose Player 2 skill level.'
      }
    }

    if (stepToValidate === 3) {
      if (!utrRegex.test(formData.utrNumber.trim())) {
        nextErrors.utrNumber = 'Enter an alphanumeric UTR or transaction ID of at least 8 characters.'
      }
      if (!phoneRegex.test(formData.paymentPhone.trim())) {
        nextErrors.paymentPhone = 'Enter the phone number used for payment.'
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const goNext = () => {
    if (!validateStep(step)) return
    setStep((current) => Math.min(current + 1, 3))
  }

  const goBack = () => {
    setSubmitError('')
    setStep((current) => Math.max(current - 1, 1))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError('')

    if (!validateStep(3)) return

    try {
      setLoadingMessage('Saving registration...')
      const registerResponse = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const registerResult = await registerResponse.json()

      if (!registerResponse.ok) {
        throw new Error(registerResult.error || 'Registration failed.')
      }

      setRegistrationId(registerResult.registrationId)
      setLoadingMessage('')
    } catch (error) {
      setLoadingMessage('')
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    }
  }

  const isSubmitting = Boolean(loadingMessage)

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'var(--input-border-focus)'
  }
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'var(--input-border)'
  }

  const successContent = (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full"
        style={{
          border: '1px solid rgba(255, 94, 0, 0.3)',
          backgroundColor: 'rgba(255, 94, 0, 0.1)',
        }}
      >
        <CheckCircle size={32} style={{ color: 'var(--accent-primary)' }} />
      </div>
      <div className="max-w-[540px]">
        <p className="font-body text-base font-semibold" style={{ color: 'var(--accent-primary)' }}>
          Registration Submitted Successfully!
        </p>
        <p className="mt-4 font-body text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          Thank you for registering for the RallyVerse Badminton Tournament.
        </p>
        <p className="mt-1 font-body text-sm" style={{ color: 'var(--text-muted)' }}>
          Registration ID: <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{registrationId}</span>
        </p>
        <p className="mt-4 font-body text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Our team will verify your payment details and confirm your registration shortly.
        </p>
        <p className="mt-4 font-body text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Please send a screenshot of your payment on WhatsApp:
        </p>
        <a
          href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block font-body text-base font-semibold transition-colors hover:opacity-80"
          style={{ color: 'var(--accent-primary)' }}
        >
          {whatsappNumber}
        </a>
        <p className="mt-5 font-body text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          While we process registrations, join the official tournament WhatsApp group to receive updates, schedules, and announcements.
        </p>
        <a
          href={whatsappGroupLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-md px-10 py-5 font-body text-base font-bold tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: 'var(--gradient-brand)',
            color: 'var(--btn-primary-text)',
          }}
        >
          Join WhatsApp Group
        </a>
        <p className="mt-5 font-body text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          If you have any questions, feel free to contact the RallyVerse team.
        </p>
        <p className="mt-4 font-body text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          See you on the court!
        </p>
      </div>
      <Link
        href="/"
            className="mt-4 inline-flex items-center rounded-md px-8 py-4 font-body text-base font-semibold transition-all duration-200"
            style={{
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)'
              e.currentTarget.style.color = 'var(--accent-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
          >
            &larr; Back to the Verse
      </Link>
    </div>
  )

  const formContent = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div aria-label="Registration progress" className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-center gap-3">
            <div
              className="h-3 w-3 rounded-full transition-colors"
              style={{ backgroundColor: step >= item ? 'var(--accent-primary)' : 'var(--bg-subtle)' }}
            />
            <div className="h-px flex-1 transition-colors" style={{ backgroundColor: step > item ? 'var(--accent-primary)' : 'var(--bg-subtle)' }} />
          </div>
        ))}
      </div>

      {submitError && (
        <div role="alert" aria-live="polite" className="rounded-md border p-3" style={{ borderColor: 'rgba(255, 68, 68, 0.3)', backgroundColor: 'rgba(255, 68, 68, 0.1)' }}>
          <p className="font-body text-sm" style={{ color: 'var(--error-color)' }}>{submitError}</p>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-6">
          <div>
            <p className="font-display text-[32px] uppercase leading-none" style={{ color: 'var(--text-primary)' }}>
              Step 1 / Event Details
            </p>
            <p className="mt-2 font-body text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Choose your category so we can place you in the right draw.
            </p>
          </div>

          <div>
            <label htmlFor="category" className={labelClass} style={{ color: 'var(--text-muted)' }}>
              Category <span style={{ color: 'var(--accent-primary)' }}>*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={selectClass}
              style={inputBaseStyle}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <FieldError message={errors.category} />
          </div>

          {needsPlayer2 && (
            <div>
              <label htmlFor="teamName" className={labelClass} style={{ color: 'var(--text-muted)' }}>
                Team Name
              </label>
              <input
                id="teamName"
                name="teamName"
                type="text"
                value={formData.teamName}
                onChange={handleChange}
                className={inputClass}
                style={inputBaseStyle}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Optional team name"
              />
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-8">
          <div>
            <p className="font-display text-[32px] uppercase leading-none" style={{ color: 'var(--text-primary)' }}>
              Step 2 / Player Details
            </p>
            <p className="mt-2 font-body text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Tell us who is playing and where you are coming from.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <p className="font-body text-xs uppercase tracking-widest" style={{ color: 'var(--accent-primary)' }}>Player 1</p>
            </div>
            <div>
              <label htmlFor="player1Name" className={labelClass} style={{ color: 'var(--text-muted)' }}>
                Player 1 Full Name <span style={{ color: 'var(--accent-primary)' }}>*</span>
              </label>
              <input id="player1Name" name="player1Name" value={formData.player1Name} onChange={handleChange} className={inputClass} style={inputBaseStyle} onFocus={handleInputFocus} onBlur={handleInputBlur} />
              <FieldError message={errors.player1Name} />
            </div>
            <div>
              <label htmlFor="player1Phone" className={labelClass} style={{ color: 'var(--text-muted)' }}>
                Player 1 WhatsApp Number <span style={{ color: 'var(--accent-primary)' }}>*</span>
              </label>
              <input id="player1Phone" name="player1Phone" type="tel" value={formData.player1Phone} onChange={handleChange} className={inputClass} style={inputBaseStyle} onFocus={handleInputFocus} onBlur={handleInputBlur} placeholder="+91 98765 43210" />
              <FieldError message={errors.player1Phone} />
            </div>
            <div>
              <label htmlFor="player1Email" className={labelClass} style={{ color: 'var(--text-muted)' }}>
                Player 1 Email
              </label>
              <input id="player1Email" name="player1Email" type="email" value={formData.player1Email} onChange={handleChange} className={inputClass} style={inputBaseStyle} onFocus={handleInputFocus} onBlur={handleInputBlur} />
              <FieldError message={errors.player1Email} />
            </div>
            <div>
              <label htmlFor="player1SkillLevel" className={labelClass} style={{ color: 'var(--text-muted)' }}>
                Player 1 Skill Level <span style={{ color: 'var(--accent-primary)' }}>*</span>
              </label>
              <select id="player1SkillLevel" name="player1SkillLevel" value={formData.player1SkillLevel} onChange={handleChange} className={selectClass} style={inputBaseStyle} onFocus={handleInputFocus} onBlur={handleInputBlur}>
                <option value="" disabled>Select skill level</option>
                {skillLevels.map((level) => <option key={level} value={level}>{level}</option>)}
              </select>
              <FieldError message={errors.player1SkillLevel} />
            </div>
          </div>

          {needsPlayer2 && (
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <p className="font-body text-xs uppercase tracking-widest" style={{ color: 'var(--accent-primary)' }}>Player 2</p>
              </div>
              <div>
                <label htmlFor="player2Name" className={labelClass} style={{ color: 'var(--text-muted)' }}>
                  Player 2 Full Name <span style={{ color: 'var(--accent-primary)' }}>*</span>
                </label>
                <input id="player2Name" name="player2Name" value={formData.player2Name} onChange={handleChange} className={inputClass} style={inputBaseStyle} onFocus={handleInputFocus} onBlur={handleInputBlur} />
                <FieldError message={errors.player2Name} />
              </div>
              <div>
                <label htmlFor="player2Phone" className={labelClass} style={{ color: 'var(--text-muted)' }}>
                  Player 2 WhatsApp Number <span style={{ color: 'var(--accent-primary)' }}>*</span>
                </label>
                <input id="player2Phone" name="player2Phone" type="tel" value={formData.player2Phone} onChange={handleChange} className={inputClass} style={inputBaseStyle} onFocus={handleInputFocus} onBlur={handleInputBlur} placeholder="+91 98765 43210" />
                <FieldError message={errors.player2Phone} />
              </div>
              <div>
                <label htmlFor="player2Email" className={labelClass} style={{ color: 'var(--text-muted)' }}>
                  Player 2 Email
                </label>
                <input id="player2Email" name="player2Email" type="email" value={formData.player2Email} onChange={handleChange} className={inputClass} style={inputBaseStyle} onFocus={handleInputFocus} onBlur={handleInputBlur} />
                <FieldError message={errors.player2Email} />
              </div>
              <div>
                <label htmlFor="player2SkillLevel" className={labelClass} style={{ color: 'var(--text-muted)' }}>
                  Player 2 Skill Level <span style={{ color: 'var(--accent-primary)' }}>*</span>
                </label>
                <select id="player2SkillLevel" name="player2SkillLevel" value={formData.player2SkillLevel} onChange={handleChange} className={selectClass} style={inputBaseStyle} onFocus={handleInputFocus} onBlur={handleInputBlur}>
                  <option value="" disabled>Select skill level</option>
                  {skillLevels.map((level) => <option key={level} value={level}>{level}</option>)}
                </select>
                <FieldError message={errors.player2SkillLevel} />
              </div>
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="city" className={labelClass} style={{ color: 'var(--text-muted)' }}>
                City <span style={{ color: 'var(--accent-primary)' }}>*</span>
              </label>
              <input id="city" name="city" value={formData.city} onChange={handleChange} className={inputClass} style={inputBaseStyle} onFocus={handleInputFocus} onBlur={handleInputBlur} />
              <FieldError message={errors.city} />
            </div>
            <div>
              <label htmlFor="collegeOrOrg" className={labelClass} style={{ color: 'var(--text-muted)' }}>
                College / Organization
              </label>
              <input id="collegeOrOrg" name="collegeOrOrg" value={formData.collegeOrOrg} onChange={handleChange} className={inputClass} style={inputBaseStyle} onFocus={handleInputFocus} onBlur={handleInputBlur} />
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-6">
          <div>
            <p className="font-display text-[32px] uppercase leading-none" style={{ color: 'var(--text-primary)' }}>
              Step 3 / Payment
            </p>
            <p className="mt-2 font-body text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Complete the payment and enter your transaction details below.
            </p>
          </div>

          <div className="rounded-md p-5" style={{ border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
            <p className="font-body text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Payment Details</p>
            <div className="mt-4 grid gap-3 font-body text-sm" style={{ color: 'var(--text-primary)' }}>
              <p>UPI ID: <span className="font-semibold" style={{ color: 'var(--accent-primary)' }}>{upiId}</span></p>
              <p>Amount: <span className="font-semibold" style={{ color: 'var(--accent-primary)' }}>Rs. {entryFee}</span></p>
            </div>
          </div>

          <div>
            <label htmlFor="utrNumber" className={labelClass} style={{ color: 'var(--text-muted)' }}>
              UTR Number / Transaction ID <span style={{ color: 'var(--accent-primary)' }}>*</span>
            </label>
            <input id="utrNumber" name="utrNumber" value={formData.utrNumber} onChange={handleChange} className={inputClass} style={inputBaseStyle} onFocus={handleInputFocus} onBlur={handleInputBlur} placeholder="Minimum 8 alphanumeric characters" />
            <FieldError message={errors.utrNumber} />
          </div>

          <div>
            <label htmlFor="paymentPhone" className={labelClass} style={{ color: 'var(--text-muted)' }}>
              Phone Number Used For Payment <span style={{ color: 'var(--accent-primary)' }}>*</span>
            </label>
            <input id="paymentPhone" name="paymentPhone" type="tel" value={formData.paymentPhone} onChange={handleChange} className={inputClass} style={inputBaseStyle} onFocus={handleInputFocus} onBlur={handleInputBlur} placeholder="+91 98765 43210" />
            <FieldError message={errors.paymentPhone} />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        {step > 1 && (
          <button
            type="button"
            onClick={goBack}
            disabled={isSubmitting}
            className="min-h-[56px] rounded-md px-8 py-4 font-body text-base font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)'
              e.currentTarget.style.color = 'var(--accent-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
          >
            Back
          </button>
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            className="min-h-[56px] flex-1 rounded-md px-8 py-4 font-body text-base font-bold tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'var(--gradient-brand)',
              color: 'var(--btn-primary-text)',
            }}
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="min-h-[56px] flex-1 rounded-md px-8 py-4 font-body text-base font-bold tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
            style={{
              background: 'var(--gradient-brand)',
              color: 'var(--btn-primary-text)',
            }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2" style={{ borderColor: 'var(--btn-primary-text)', borderTopColor: 'transparent' }} />
                {loadingMessage}
              </span>
            ) : (
              'Submit Registration'
            )}
          </button>
        )}
      </div>
    </form>
  )

  return (
    <section id="register" className="py-32"
      style={{
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      <div className="mx-auto max-w-[760px] px-6">
        <AnimatedSection>
          <div className="flex items-center gap-3">
            <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
            <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              REGISTRATION
            </span>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="mt-5 font-display text-[36px] leading-none uppercase sm:text-[40px] md:text-[64px]" style={{ color: 'var(--text-primary)' }}>
            YOUR VERSE
            <br />
            STARTS HERE.
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <p className="mt-4 mb-12 font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            You&apos;re about to become one of the first people to step into the RallyVerse. Fill in your details. We&apos;ll handle everything else.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          {registrationId ? successContent : formContent}
        </AnimatedSection>
      </div>
    </section>
  )
}
