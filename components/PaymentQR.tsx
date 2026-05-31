'use client'

export default function PaymentQR() {
  const qrUrl = process.env.NEXT_PUBLIC_PAYMENT_QR_URL

  if (!qrUrl) {
    return (
      <div
        className="flex items-center justify-center rounded-md"
        style={{
          width: 180,
          height: 180,
          border: '1px dashed var(--border-subtle)',
          backgroundColor: 'var(--bg-subtle)',
        }}
      >
        <p className="px-4 text-center font-body text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Scan QR from your UPI app to pay
        </p>
      </div>
    )
  }

  return (
    <img
      src={qrUrl}
      alt="Payment QR Code"
      className="rounded-md"
      style={{ width: 180, height: 180, objectFit: 'contain' }}
    />
  )
}
