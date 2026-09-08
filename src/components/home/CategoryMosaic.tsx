"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calculator as CalculatorIcon, X } from "lucide-react"
import { DynamicCalculatorSection } from "@/components/home/DynamicCalculatorSection"

interface MosaicCard {
  overline: string
  title: string
  accent: string
  href: string
  image: string
  /** clases de grid: cómo ocupa la celda en móvil y en desktop */
  span: string
  /** ocupa el ancho completo en móvil (card grande) */
  wide?: boolean
  /** paleta de la tarjeta */
  tone: "dark" | "light" | "brand"
}

const cards: MosaicCard[] = [
  {
    overline: "Lo Nuevo",
    title: "Placas y perfiles",
    accent: "GYPSUM",
    href: "/products?category=gypsum",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    span: "col-span-1 lg:col-span-8",
    tone: "light",
  },
  {
    overline: "Tendencia",
    title: "Insumos y",
    accent: "HERRAMIENTAS",
    href: "/products?category=insumos",
    image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800",
    span: "col-span-2 lg:col-span-6",
    wide: true,
    tone: "brand",
  },
  {
    overline: "Lo Mejor",
    title: "Paneles y duelas",
    accent: "PVC / WPC",
    href: "/products?category=duelas-pvc",
    image: "https://images.unsplash.com/photo-1586864387789-628af9feed72?w=800",
    span: "col-span-1 lg:col-span-3",
    tone: "light",
  },
  {
    overline: "En Casa",
    title: "Cielo raso e",
    accent: "ILUMINACIÓN",
    href: "/products?category=iluminacion-led",
    image: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800",
    span: "col-span-1 lg:col-span-3",
    tone: "dark",
  },
]

const toneStyles: Record<MosaicCard["tone"], { bg: string; overline: string; title: string; accent: string; btn: string }> = {
  dark: {
    bg: "bg-[#111827] dark:bg-[#0B1220]",
    overline: "text-white/55",
    title: "text-white",
    accent: "text-white/25",
    btn: "bg-brand-orange text-white",
  },
  light: {
    bg: "bg-slate-100 dark:bg-slate-800",
    overline: "text-slate-500 dark:text-slate-400",
    title: "text-slate-900 dark:text-white",
    accent: "text-brand-orange",
    btn: "bg-brand-orange text-white",
  },
  brand: {
    bg: "bg-[#D93025] dark:bg-[#B3251C]",
    overline: "text-white/70",
    title: "text-white",
    accent: "text-white",
    btn: "bg-white text-[#D93025]",
  },
}

export function CategoryMosaic() {
  const [openCalc, setOpenCalc] = useState(false)

  return (
    <section className="container mx-auto px-4 pt-3 pb-2">
      <div className="grid grid-cols-2 lg:grid-cols-12 gap-2.5 sm:gap-3">
        {/* Tarjeta destacada: abre la calculadora en popup */}
        <button
          type="button"
          onClick={() => setOpenCalc(true)}
          className="col-span-1 lg:col-span-4 group relative overflow-hidden rounded-xl text-left h-[150px] sm:h-[190px] transition-transform active:scale-[0.99] hover:-translate-y-0.5"
          style={{ background: "linear-gradient(160deg, #2E6BFF 0%, #1E4FD6 55%, #0a1a3a 100%)" }}
        >
          <div
            className="absolute -right-10 -top-10 size-36 rounded-full pointer-events-none"
            style={{ background: "rgba(255,255,255,0.18)", filter: "blur(28px)" }}
          />
          <CalculatorIcon
            className="absolute -right-4 -bottom-4 size-28 text-white/10 group-hover:text-white/15 transition-colors"
            strokeWidth={1.25}
          />
          <div className="relative z-10 flex h-full flex-col p-4">
            <span className="text-[11px] font-medium text-white/60">Cotiza al instante</span>
            <h3 className="text-base sm:text-lg font-bold leading-tight text-white">Calculadora de</h3>
            <p className="text-lg sm:text-2xl font-extrabold leading-tight tracking-tight text-white/85">
              MATERIALES
            </p>
            <span className="mt-auto inline-flex w-fit items-center rounded-full bg-brand-orange px-3.5 py-1.5 text-xs font-semibold text-white shadow-md">
              Calcular
            </span>
          </div>
        </button>

        {cards.map((card) => {
          const t = toneStyles[card.tone]
          return (
            <Link
              key={card.accent}
              href={card.href}
              className={`${card.span} group relative overflow-hidden rounded-xl ${
                card.wide ? "h-[190px] sm:h-[190px]" : "h-[150px] sm:h-[190px]"
              } ${t.bg} transition-transform hover:-translate-y-0.5`}
            >
              {/* Imagen en la esquina derecha */}
              <div
                className="absolute -right-8 transition-opacity group-hover:opacity-50"
                style={{
                  ...(card.wide
                    ? { top: "50%", transform: "translateY(-50%)", width: "192px", height: "192px", opacity: 0.35 }
                    : { bottom: "-16px", width: "160px", height: "160px", opacity: 0.4 }
                  )
                }}
              >
                <Image
                  src={card.image}
                  alt={card.accent}
                  fill
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className={`absolute inset-0 ${
                  card.tone === "light"
                    ? "bg-gradient-to-r from-slate-100 via-slate-100/85 to-transparent dark:from-slate-800 dark:via-slate-800/85"
                    : card.tone === "brand"
                    ? "bg-gradient-to-r from-[#D93025] via-[#D93025]/85 to-transparent"
                    : "bg-gradient-to-r from-[#111827] via-[#111827]/85 to-transparent"
                }`}
              />

              <div className="relative z-10 flex h-full flex-col p-4">
                <span className={`text-[11px] font-medium ${t.overline}`}>{card.overline}</span>
                <h3 className={`text-base sm:text-lg font-bold leading-tight ${t.title}`}>{card.title}</h3>
                <p className={`text-lg sm:text-2xl font-extrabold leading-tight tracking-tight ${t.accent}`}>
                  {card.accent}
                </p>
                <span
                  className={`mt-auto inline-flex w-fit items-center rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-md ${t.btn}`}
                >
                  Explorar
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Popup de la calculadora */}
      {openCalc && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center p-4"
          style={{ background: "rgba(2,4,10,0.82)", backdropFilter: "blur(5px)" }}
          onClick={() => setOpenCalc(false)}
        >
          <div
            className="relative w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpenCalc(false)}
              className="absolute -top-9 right-0 z-10 flex items-center gap-1 text-xs text-white/70 hover:text-white transition-colors"
              aria-label="Cerrar calculadora"
            >
              <X size={16} strokeWidth={1.75} />
              Cerrar
            </button>
            <div className="h-[340px]">
              <DynamicCalculatorSection />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
