"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Monitor, Keyboard, Mouse, Headphones, HardDrive, Cpu, Gamepad2, Package, ChevronRight } from "lucide-react"
import { useProductsStore } from "@/stores/products-store"
import { Skeleton } from "@/components/ui/skeleton"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Monitor: Monitor,
  Keyboard: Keyboard,
  Mouse: Mouse,
  Headphones: Headphones,
  HardDrive: HardDrive,
  Cpu: Cpu,
  Gamepad2: Gamepad2,
  Package: Package,
}

export function CategoryGrid() {
  const { categories, fetchCategories } = useProductsStore()

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return (
    <section className="pt-3 pb-1 sm:pt-4 sm:pb-2">
      <div className="container mx-auto px-4">
        {/* Title row */}
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
            Búsquedas recomendadas para ti
          </h2>
          <Link
            href="/products"
            className="text-xs font-medium text-primary hover:underline flex items-center gap-0.5"
          >
            Más sugerencias <ChevronRight className="size-3" />
          </Link>
        </div>

        {/* Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.length === 0
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-28 shrink-0 rounded-full" />
              ))
            : categories.map((category) => {
                const Icon = iconMap[category.icon] || Package
                return (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 transition-all hover:border-primary hover:text-primary"
                  >
                    <span>{category.name}</span>
                    <span className="text-slate-400 dark:text-slate-500 text-[10px] group-hover:text-primary/70">
                      {category.productCount}
                    </span>
                  </Link>
                )
              })}
        </div>
      </div>
    </section>
  )
}
