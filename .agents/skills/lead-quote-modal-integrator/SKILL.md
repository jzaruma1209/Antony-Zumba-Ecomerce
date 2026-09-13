---
name: lead-quote-modal-integrator
description: Guía y procedimientos para crear, animar e integrar modales comerciales y popups de cotización técnica en Next.js con Framer Motion, NextAuth y diseño de Stitch.
---

# Lead Quote Modal Integrator

Este skill proporciona las directrices y patrones de código para diseñar e integrar popups comerciales interactivos, cotizadores rápidos y modales de captura de leads en TumbadosZumba.

---

## 1. Patrón Base de Componente Modal (`QuoteModal.tsx`)

```tsx
"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import type { Variants } from "framer-motion"
import { X } from "lucide-react"

export interface QuoteModalProps {
  isOpen: boolean
  onClose: () => void
  whatsappNumber?: string
}

// SIEMPRE tipar explícitamente con Variants para compatibilidad con React 19 / Framer Motion 13
const listVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  whatsappNumber = "593997119881",
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto bg-black/75 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            key="modal-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl my-auto"
          >
            {/* Botón flotante exterior de 40x40px */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              className="absolute -top-11 right-0 sm:-right-12 sm:top-0 z-50 flex items-center justify-center w-10 h-10 bg-neutral-950 text-white border border-neutral-700 hover:bg-[#f25c05] hover:border-[#f25c05] shadow-2xl transition-all duration-200 cursor-pointer rounded-none group"
            >
              <X className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" strokeWidth={1.75} />
            </button>

            {/* Contenedor interno recortado */}
            <div className="w-full flex flex-col md:flex-row overflow-hidden rounded-none border border-neutral-800 bg-[#0a0a0a] shadow-2xl">
              {/* Contenido */}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

---

## 2. Inyección Automática con NextAuth

Para mostrar el modal únicamente a visitantes no autenticados:

```tsx
"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

export function GlobalTrigger() {
  const [isOpen, setIsOpen] = useState(false)
  const { status } = useSession()

  useEffect(() => {
    // Si ya está autenticado o la sesión está cargando, omitir
    if (status === "loading" || status === "authenticated") {
      return
    }

    // Si es visitante no registrado, abrir tras 2 segundos
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [status])

  return <QuoteModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
}
```

---

## 3. Checklist de Verificación
- [ ] No usar esquinas redondeadas si el diseño original de Stitch es geométrico (`rounded-none`).
- [ ] Garantizar que los enlaces internos utilicen `next/link` y cierren el popup tras la navegación.
- [ ] Comprobar que `npx tsc --noEmit` pase con 0 errores antes de hacer commit.
