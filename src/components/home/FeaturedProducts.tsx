import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { ProductCard } from "@/components/products/ProductCard"
import type { Product } from "@/types"

export function FeaturedProducts({ products }: { products: Product[] }) {
  // Sin destacados no ocupamos espacio en la home
  if (products.length === 0) return null

  return (
    <section className="py-3 sm:py-4">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Productos Destacados
          </h2>
          <Link
            href="/products"
            className="text-xs font-medium text-primary hover:underline flex items-center gap-0.5"
          >
            Ver todo <ChevronRight className="size-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
