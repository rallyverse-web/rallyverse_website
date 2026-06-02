import Image from 'next/image'

export default function PaymentQR() {
  return (
    <div className="flex items-center justify-center">
      <Image
        src="/qrcode.jpeg"
        alt="Scan to pay ₹799 — RallyVerse UPI QR Code"
        width={400}
        height={400}
        className="rounded-md"
        style={{
          width: '100%',
          maxWidth: 280,
          height: 'auto',
          aspectRatio: '1/1',
        }}
        loading="lazy"
      />
    </div>
  )
}
