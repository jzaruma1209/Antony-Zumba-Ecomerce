"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const WHATSAPP_NUM = "593997119881"
const DEFAULT_MSG =
  "Hola 👋, estoy en la página de TumbadosZumba y quiero más información."
const FACEBOOK_URL = "https://www.facebook.com/share/199R335D7Z/?mibextid=wwXIfr"
const TIKTOK_URL =
  "https://www.tiktok.com/@tumbados_zumba?_r=1&_t=ZP-99YL1dEvXNH"

const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(
  DEFAULT_MSG
)}`

const links = [
  {
    label: "Escríbenos por WhatsApp",
    href: WHATSAPP_URL,
    className: "bg-[#25D366] hover:bg-[#1eb855]",
    icon: (
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.898 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    ),
  },
  {
    label: "Síguenos en Facebook",
    href: FACEBOOK_URL,
    className: "bg-[#1877F2] hover:bg-[#0f62cc]",
    icon: (
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.412c0-3.026 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.931-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" />
    ),
  },
  {
    label: "Síguenos en TikTok",
    href: TIKTOK_URL,
    className: "bg-black hover:bg-neutral-800",
    icon: (
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z" />
    ),
  },
]

export function WhatsAppFloat() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 print:hidden">
      {links.map((link, i) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          title={link.label}
          style={{ transitionDelay: `${i * 80}ms` }}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 hover:scale-110 sm:h-14 sm:w-14",
            link.className,
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6 fill-current sm:h-7 sm:w-7"
            aria-hidden
          >
            {link.icon}
          </svg>
        </a>
      ))}
    </div>
  )
}
