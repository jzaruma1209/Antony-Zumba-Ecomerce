"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { socialLinks as links } from "@/lib/social"

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
