import Image from 'next/image'

interface WhatsAppIconProps {
  size?: number
  className?: string
  style?: React.CSSProperties
}

export default function WhatsAppIcon({ size = 24, className, style }: WhatsAppIconProps) {
  return (
    <Image
      src="/whatsapp_icon.png"
      alt="WhatsApp"
      width={size}
      height={size}
      className={className}
      style={style}
    />
  )
}
