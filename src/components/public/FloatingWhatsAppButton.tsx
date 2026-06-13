import { FaWhatsapp } from 'react-icons/fa'
import type { BusinessConfig } from '../../types'
import { createWhatsAppUrl } from '../../utils/format'

type Props = {
  config: BusinessConfig | null
}

function cleanWhatsAppNumber(value: string): string {
  return value.replace(/\D/g, '')
}

export function FloatingWhatsAppButton({ config }: Props) {
  const whatsapp = cleanWhatsAppNumber(config?.whatsapp || '')

  if (!whatsapp) {
    return null
  }

  const nombreNegocio = config?.nombreNegocio || 'Huipil Nica'
  const mensaje = `Hola, quiero consultar información sobre ${nombreNegocio}.`

  return (
    <a
      href={createWhatsAppUrl(whatsapp, mensaje)}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-4 font-bold text-white shadow-2xl transition hover:scale-105 hover:bg-[#1EBE5D] sm:px-5"
      aria-label="Consultar por WhatsApp"
    >
      <FaWhatsapp size={28} />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  )
}