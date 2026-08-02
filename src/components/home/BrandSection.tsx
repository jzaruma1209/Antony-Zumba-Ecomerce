import { brands } from "@/data/mock-products"

export function BrandSection() {
  return (
    <section className="py-8 sm:py-10 border-t border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-5">
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">Marcas que Confiamos</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Trabajamos con las mejores marcas del mercado
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
          {brands.slice(0, 8).map((brand) => (
            <div
              key={brand.id}
              className="flex items-center justify-center px-4 py-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            >
              <span className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
