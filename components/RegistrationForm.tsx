'use client'

import { ChangeEvent, FormEvent, useMemo, useState } from 'react'
import { CheckCircle, Upload } from 'lucide-react'
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
const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
const maxFileSize = 5 * 1024 * 1024

const inputClass =
  'w-full min-h-[48px] bg-surface border border-subtle text-primary placeholder:text-muted font-body text-sm px-4 py-3 rounded-md focus:outline-none focus:border-orange transition-colors duration-200'

const selectClass =
  'w-full min-h-[48px] bg-surface border border-subtle text-primary font-body text-sm px-4 py-3 rounded-md focus:outline-none focus:border-orange transition-colors duration-200 appearance-none cursor-pointer'

const labelClass = 'mb-2 block font-body text-sm text-muted'
const errorClass = 'mt-2 font-body text-xs text-red-400'

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
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState('')
  const [loadingMessage, setLoadingMessage] = useState('')
  const [registrationId, setRegistrationId] = useState('')

  const needsPlayer2 = useMemo(() => isDoublesCategory(formData.category), [formData.category])
  const upiId = process.env.NEXT_PUBLIC_UPI_ID || 'adityag,007@ptaxis'
  const entryFee = process.env.NEXT_PUBLIC_ENTRY_FEE || '800'

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setScreenshot(file)
    setErrors((current) => ({ ...current, screenshot: '' }))
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
      if (!screenshot) {
        nextErrors.screenshot = 'Upload your payment screenshot.'
      } else if (!allowedFileTypes.includes(screenshot.type)) {
        nextErrors.screenshot = 'Only JPG, PNG, or WEBP screenshots are allowed.'
      } else if (screenshot.size > maxFileSize) {
        nextErrors.screenshot = 'Screenshot must be 5MB or smaller.'
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

    if (!validateStep(3) || !screenshot) return

    try {
      setLoadingMessage('Uploading your screenshot...')
      const uploadFormData = new FormData()
      uploadFormData.append('screenshot', screenshot)
      uploadFormData.append('registrationId', `RV-PAYMENT-${Date.now()}`)

      const uploadResponse = await fetch('/api/upload-screenshot', {
        method: 'POST',
        body: uploadFormData,
      })
      const uploadResult = await uploadResponse.json()

      if (!uploadResponse.ok) {
        throw new Error(uploadResult.error || 'Screenshot upload failed.')
      }

      setLoadingMessage('Saving registration...')
      const registerResponse = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          screenshotUrl: uploadResult.fileUrl,
        }),
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

  const successContent = (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-orange/30 bg-orange/10">
        <CheckCircle size={32} className="text-orange" />
      </div>
      <div>
        <p className="font-display text-[48px] uppercase leading-none text-primary md:text-[64px]">
          YOU&apos;RE IN.
        </p>
        <p className="mt-4 font-body text-base text-primary">
          Registration ID: {registrationId}
        </p>
        <p className="mt-5 max-w-[430px] font-body text-base leading-relaxed text-muted">
          We&apos;ve received your payment screenshot. Our team will verify and confirm within 24 hours.
        </p>
        <p className="mt-3 max-w-[430px] font-body text-base leading-relaxed text-muted">
          Watch for our WhatsApp message.
        </p>
      </div>
      <Link
        href="/"
        className="mt-4 inline-flex items-center rounded-md border border-subtle px-6 py-3 font-body text-sm font-semibold text-primary transition-all duration-200 hover:border-orange hover:text-orange"
      >
        &larr; Back to Home
      </Link>
    </div>
  )

  const formContent = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div aria-label="Registration progress" className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-center gap-3">
            <div
              className={`h-3 w-3 rounded-full transition-colors ${
                step >= item ? 'bg-orange' : 'bg-subtle'
              }`}
            />
            <div className={`h-px flex-1 ${step > item ? 'bg-orange' : 'bg-subtle'}`} />
          </div>
        ))}
      </div>

      {submitError && (
        <div role="alert" aria-live="polite" className="rounded-md border border-red-500/30 bg-red-500/10 p-3">
          <p className="font-body text-sm text-red-400">{submitError}</p>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-6">
          <div>
            <p className="font-display text-[32px] uppercase leading-none text-primary">
              Step 1 / Event Details
            </p>
            <p className="mt-2 font-body text-sm leading-relaxed text-muted">
              Choose your category so we can place you in the right draw.
            </p>
          </div>

          <div>
            <label htmlFor="category" className={labelClass}>
              Category <span className="text-orange">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={selectClass}
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
              <label htmlFor="teamName" className={labelClass}>
                Team Name
              </label>
              <input
                id="teamName"
                name="teamName"
                type="text"
                value={formData.teamName}
                onChange={handleChange}
                className={inputClass}
                placeholder="Optional team name"
              />
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-8">
          <div>
            <p className="font-display text-[32px] uppercase leading-none text-primary">
              Step 2 / Player Details
            </p>
            <p className="mt-2 font-body text-sm leading-relaxed text-muted">
              Tell us who is playing and where you are coming from.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <p className="font-body text-xs uppercase tracking-widest text-orange">Player 1</p>
            </div>
            <div>
              <label htmlFor="player1Name" className={labelClass}>
                Player 1 Full Name <span className="text-orange">*</span>
              </label>
              <input id="player1Name" name="player1Name" value={formData.player1Name} onChange={handleChange} className={inputClass} />
              <FieldError message={errors.player1Name} />
            </div>
            <div>
              <label htmlFor="player1Phone" className={labelClass}>
                Player 1 WhatsApp Number <span className="text-orange">*</span>
              </label>
              <input id="player1Phone" name="player1Phone" type="tel" value={formData.player1Phone} onChange={handleChange} className={inputClass} placeholder="+91 98765 43210" />
              <FieldError message={errors.player1Phone} />
            </div>
            <div>
              <label htmlFor="player1Email" className={labelClass}>
                Player 1 Email
              </label>
              <input id="player1Email" name="player1Email" type="email" value={formData.player1Email} onChange={handleChange} className={inputClass} />
              <FieldError message={errors.player1Email} />
            </div>
            <div>
              <label htmlFor="player1SkillLevel" className={labelClass}>
                Player 1 Skill Level <span className="text-orange">*</span>
              </label>
              <select id="player1SkillLevel" name="player1SkillLevel" value={formData.player1SkillLevel} onChange={handleChange} className={selectClass}>
                <option value="" disabled>Select skill level</option>
                {skillLevels.map((level) => <option key={level} value={level}>{level}</option>)}
              </select>
              <FieldError message={errors.player1SkillLevel} />
            </div>
          </div>

          {needsPlayer2 && (
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <p className="font-body text-xs uppercase tracking-widest text-orange">Player 2</p>
              </div>
              <div>
                <label htmlFor="player2Name" className={labelClass}>
                  Player 2 Full Name <span className="text-orange">*</span>
                </label>
                <input id="player2Name" name="player2Name" value={formData.player2Name} onChange={handleChange} className={inputClass} />
                <FieldError message={errors.player2Name} />
              </div>
              <div>
                <label htmlFor="player2Phone" className={labelClass}>
                  Player 2 WhatsApp Number <span className="text-orange">*</span>
                </label>
                <input id="player2Phone" name="player2Phone" type="tel" value={formData.player2Phone} onChange={handleChange} className={inputClass} placeholder="+91 98765 43210" />
                <FieldError message={errors.player2Phone} />
              </div>
              <div>
                <label htmlFor="player2Email" className={labelClass}>
                  Player 2 Email
                </label>
                <input id="player2Email" name="player2Email" type="email" value={formData.player2Email} onChange={handleChange} className={inputClass} />
                <FieldError message={errors.player2Email} />
              </div>
              <div>
                <label htmlFor="player2SkillLevel" className={labelClass}>
                  Player 2 Skill Level <span className="text-orange">*</span>
                </label>
                <select id="player2SkillLevel" name="player2SkillLevel" value={formData.player2SkillLevel} onChange={handleChange} className={selectClass}>
                  <option value="" disabled>Select skill level</option>
                  {skillLevels.map((level) => <option key={level} value={level}>{level}</option>)}
                </select>
                <FieldError message={errors.player2SkillLevel} />
              </div>
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="city" className={labelClass}>
                City <span className="text-orange">*</span>
              </label>
              <input id="city" name="city" value={formData.city} onChange={handleChange} className={inputClass} />
              <FieldError message={errors.city} />
            </div>
            <div>
              <label htmlFor="collegeOrOrg" className={labelClass}>
                College / Organization
              </label>
              <input id="collegeOrOrg" name="collegeOrOrg" value={formData.collegeOrOrg} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-6">
          <div>
            <p className="font-display text-[32px] uppercase leading-none text-primary">
              Step 3 / Payment
            </p>
            <p className="mt-2 font-body text-sm leading-relaxed text-muted">
              Complete the payment, then upload the screenshot for verification.
            </p>
          </div>

          <div className="rounded-md border border-subtle bg-surface p-5">
            <p className="font-body text-xs uppercase tracking-widest text-muted">Payment Details</p>
            <div className="mt-4 grid gap-3 font-body text-sm text-primary">
              <p>UPI ID: <span className="font-semibold text-orange">{upiId}</span></p>
              <p>Amount: <span className="font-semibold text-orange">Rs. {entryFee}</span></p>
            </div>
          </div>

          <div>
            <label htmlFor="utrNumber" className={labelClass}>
              UTR Number / Transaction ID <span className="text-orange">*</span>
            </label>
            <input id="utrNumber" name="utrNumber" value={formData.utrNumber} onChange={handleChange} className={inputClass} placeholder="Minimum 8 alphanumeric characters" />
            <FieldError message={errors.utrNumber} />
          </div>

          <div>
            <label htmlFor="screenshot" className={labelClass}>
              Payment Screenshot <span className="text-orange">*</span>
            </label>
            <label htmlFor="screenshot" className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-3 rounded-md border border-dashed border-subtle bg-surface px-4 py-6 text-center transition-colors hover:border-orange">
              <Upload size={24} className="text-orange" />
              <span className="font-body text-sm text-primary">
                {screenshot ? screenshot.name : 'Upload JPG, PNG, or WEBP up to 5MB'}
              </span>
            </label>
            <input id="screenshot" name="screenshot" type="file" accept="image/jpeg,image/png,image/jpg,image/webp" onChange={handleFileChange} className="sr-only" />
            <FieldError message={errors.screenshot} />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        {step > 1 && (
          <button
            type="button"
            onClick={goBack}
            disabled={isSubmitting}
            className="min-h-[48px] rounded-md border border-subtle px-6 py-3 font-body text-sm font-semibold text-primary transition-all duration-200 hover:border-orange hover:text-orange disabled:cursor-not-allowed disabled:opacity-60"
          >
            Back
          </button>
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            className="min-h-[48px] flex-1 rounded-md bg-brand-gradient px-6 py-3 font-body text-sm font-bold tracking-wide text-carbon transition-all duration-200 hover:scale-[1.02] hover:glow-orange active:scale-[0.98]"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="min-h-[48px] flex-1 rounded-md bg-brand-gradient px-6 py-3 font-body text-sm font-bold tracking-wide text-carbon transition-all duration-200 hover:scale-[1.02] hover:glow-orange active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-carbon border-t-transparent" />
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
    <section id="register" className="border-t border-subtle bg-carbon py-32">
      <div className="mx-auto max-w-[760px] px-6">
        <AnimatedSection>
          <div className="flex items-center gap-3">
            <div className="h-px w-10 bg-orange" />
            <span className="font-body text-[11px] uppercase tracking-widest text-muted">
              TOURNAMENT REGISTRATION
            </span>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="mt-5 font-display text-[40px] leading-none uppercase text-primary md:text-[64px]">
            CLAIM YOUR
            <br />
            SPOT.
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <p className="mt-4 mb-12 font-body text-base leading-relaxed text-muted">
            Register for RallyVerse Rally Series #01. Payment verification happens manually after your screenshot is received.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          {registrationId ? successContent : formContent}
        </AnimatedSection>
      </div>
    </section>
  )
}
