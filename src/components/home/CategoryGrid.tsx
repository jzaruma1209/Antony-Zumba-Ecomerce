import Link from "next/link"
import { Search, TrendingUp } from "lucide-react"

interface PopularProduct {
  id: string
  name: string
  slug: string
  price: number
}

export function CategoryGrid({ products }: { products: PopularProduct[] }) {
  const topProducts = products.slice(0, 4)

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
          {topProducts.length === 0
            ? (
                <div className="text-xs text-muted-foreground py-1">
                  No hay productos disponibles actualmente
                </div>
              )
            : topProducts.map((product) => (
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
