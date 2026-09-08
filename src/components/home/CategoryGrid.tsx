"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, TrendingUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface PopularProduct {
  id: string
  name: string
  slug: string
  price: number
}

export function CategoryGrid() {
  const [products, setProducts] = useState<PopularProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPopularProducts() {
      try {
        const res = await fetch("/api/products?sortBy=best-selling&limit=4")
        if (res.ok) {
          const data = await res.json()
          if (data.products && Array.isArray(data.products)) {
            setProducts(data.products.slice(0, 4))
          }
        }
      } catch (err) {
        console.error("Error cargando productos más buscados:", err)
      } finally {
        setLoading(false)
      }
    }
    loadPopularProducts()
  }, [])

  return (
    <section className="pt-2 pb-0.5 sm:pt-2.5 sm:pb-1">
      <div className="container mx-auto px-4">
        {/* Title row */}
        <div className="mb-1.5 flex items-center gap-1.5">
          <TrendingUp className="size-3.5 text-brand-orange" strokeWidth={1.75} />
          <h2 className="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300">
            Productos más buscados
          </h2>
        </div>

        {/* Pills de productos más buscados (primeros 4, sin scrollbar) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-28 shrink-0 rounded-full" />
              ))
            : products.length === 0
            ? (
                <div className="text-xs text-muted-foreground py-1">
                  No hay productos disponibles actualmente
                </div>
              )
            : products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group inline-flex shrink-0 items-center gap-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 transition-all hover:border-brand-orange hover:text-brand-orange shadow-xs"
                >
                  <Search className="size-2.5 text-slate-400 group-hover:text-brand-orange transition-colors" strokeWidth={1.75} />
                  <span>{product.name}</span>
                  {product.price > 0 && (
                    <span className="text-[9px] font-mono font-semibold text-brand-navy dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded-full">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  )}
                </Link>
              ))}
        </div>
      </div>
    </section>
  )
}
