"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface BrandItem {
  id: string
  name: string
  slug: string
  logo?: string | null
  productCount?: number
}

export function BrandSection() {
  const [brands, setBrands] = useState<BrandItem[]>([])
  const [loading, setLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadBrands() {
      try {
        const res = await fetch("/api/brands")
        if (res.ok) {
          const data = await res.json()
          setBrands(data)
        }
      } catch (err) {
        console.error("Error al cargar marcas:", err)
      } finally {
        setLoading(false)
      }
    }
    loadBrands()
  }, [])

  const [canScroll, setCanScroll] = useState(false)

  const checkScrollable = () => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScroll(scrollWidth > clientWidth)
    }
  }

  useEffect(() => {
    checkScrollable()
    window.addEventListener("resize", checkScrollable)
    return () => window.removeEventListener("resize", checkScrollable)
  }, [brands])

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (!loading && brands.length === 0) {
    return null
  }

  return (
    <section className="py-8 sm:py-10 border-t border-slate-100 dark:border-slate-800 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Marcas que Confiamos
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Trabajamos con las mejores marcas del mercado
          </p>
        </div>

        <div className="relative group max-w-5xl mx-auto flex items-center justify-center">
          {/* Botón scroll izquierda (sólo si hay scroll) */}
          {canScroll && (
            <button
              onClick={() => scroll("left")}
              aria-label="Anterior"
              className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-10 size-8 sm:size-9 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-foreground transition-all opacity-80 hover:opacity-100"
            >
              <ChevronLeft className="size-5" strokeWidth={1.75} />
            </button>
          )}

          {/* Carrusel / Lista de marcas perfectamente centrada */}
          <div
            ref={scrollContainerRef}
            className="flex items-center justify-center gap-3 sm:gap-4 overflow-x-auto scroll-smooth py-2 px-4 no-scrollbar w-full"
          >
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-11 w-32 shrink-0 rounded-lg" />
                ))
              : brands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/products?brand=${brand.slug}`}
                    className="flex shrink-0 items-center justify-center px-5 py-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-brand-orange hover:shadow-sm transition-all group/card"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 group-hover/card:text-brand-orange transition-colors">
                      {brand.name}
                    </span>
                  </Link>
                ))}
          </div>

          {/* Botón scroll derecha (sólo si hay scroll) */}
          {canScroll && (
            <button
              onClick={() => scroll("right")}
              aria-label="Siguiente"
              className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-10 size-8 sm:size-9 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-foreground transition-all opacity-80 hover:opacity-100"
            >
              <ChevronRight className="size-5" strokeWidth={1.75} />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

