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
    title: "Placas y",
    accent: "GYPSUM",
    href: "/products?category=gypsum",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    span: "col-span-1 lg:col-span-3",
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
    overline: "En Casa",
    title: "Cielo raso e",
    accent: "ILUMINACIÓN",
    href: "/products?category=iluminacion-led",
    image: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800",
    span: "col-span-2 lg:col-span-6",
    wide: true,
    tone: "dark",
  },
  {
    overline: "Lo Mejor",
    title: "Paneles y",
    accent: "PVC / WPC",
    href: "/products?category=duelas-pvc",
    image: "https://images.unsplash.com/photo-1586864387789-628af9feed72?w=800",
    span: "col-span-1 lg:col-span-3",
    tone: "light",
  },
  {
    overline: "Diseño & Lujo",
    title: "Láminas PVC",
    accent: "MÁRMOL",
    href: "/products?category=marmol-pvc",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    span: "col-span-1 lg:col-span-3",
    tone: "light",
  },
]

const toneStyles: Record<
  MosaicCard["tone"],
  { bg: string; overline: string; title: string; accent: string; btn: string }
> = {
  dark: {
    bg: "bg-[#111827] dark:bg-[#0B1220]",
    overline: "text-white/55",
    title: "text-white",
    accent: "text-white/35",
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
    <section className="container mx-auto px-4 pt-4 pb-3">
      <div className="grid grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4">
        {/* Tarjeta destacada: abre la calculadora en popup */}
        <button
          type="button"
          onClick={() => setOpenCalc(true)}
          className="col-span-1 lg:col-span-3 group relative overflow-hidden rounded-2xl text-left h-[150px] sm:h-[178px] transition-transform active:scale-[0.99] hover:-translate-y-0.5"
          style={{ background: "linear-gradient(160deg, #2E6BFF 0%, #1E4FD6 55%, #0a1a3a 100%)" }}
        >
          <div
            className="absolute -right-10 -top-10 size-36 rounded-full pointer-events-none"
            style={{ background: "rgba(255,255,255,0.18)", filter: "blur(28px)" }}
          />
          <CalculatorIcon
            className="absolute -right-5 -bottom-5 size-32 text-white/15 group-hover:text-white/25 transition-colors"
            strokeWidth={1.25}
          />
          <div className="relative z-10 flex h-full flex-col p-4 sm:p-5">
            <span className="text-[11px] font-medium text-white/60">Cotiza al instante</span>
            <h3 className="text-base sm:text-lg font-bold leading-tight text-white">Calculadora de</h3>
            <p className="text-xl sm:text-2xl font-extrabold leading-tight tracking-tight text-white/90">
              MATERIALES
            </p>
            <span className="mt-auto inline-flex w-fit items-center rounded-full bg-brand-orange px-4 py-1.5 text-xs font-semibold text-white shadow-md">
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
              className={`${card.span} group relative overflow-hidden rounded-2xl h-[150px] sm:h-[178px] ${t.bg} transition-transform hover:-translate-y-0.5`}
            >
              {/* Panel de imagen a la derecha, nítido y visible */}
              <div
                className={`absolute right-3 top-3 bottom-3 overflow-hidden rounded-xl ${
                  card.wide ? "w-[32%] sm:w-[28%]" : "w-[42%] sm:w-[42%]"
                }`}
              >
                <Image
                  src={card.image}
                  alt={card.accent}
                  fill
                  sizes="(max-width: 1024px) 45vw, 300px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="relative z-10 flex h-full w-[58%] sm:w-[56%] flex-col p-4 sm:p-5">
                <span className={`text-[11px] font-medium ${t.overline}`}>{card.overline}</span>
                <h3 className={`text-base sm:text-lg font-bold leading-tight ${t.title}`}>{card.title}</h3>
                <p
                  className={`font-extrabold leading-tight tracking-tight ${
                    card.wide ? "text-lg sm:text-2xl" : "text-lg sm:text-xl"
                  } ${t.accent}`}
                >
                  {card.accent}
                </p>
                <span
                  className={`mt-auto inline-flex w-fit items-center rounded-full px-4 py-1.5 text-xs font-semibold shadow-md ${t.btn}`}
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
