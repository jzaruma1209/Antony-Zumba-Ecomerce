import { HeroBanner } from "@/components/home/HeroBanner"
import { CategoryGrid } from "@/components/home/CategoryGrid"
import { CategoryMosaic } from "@/components/home/CategoryMosaic"
import { FeaturedProducts } from "@/components/home/FeaturedProducts"
import { BrandSection } from "@/components/home/BrandSection"

export default function HomePage() {
  return (
    <>
      {/* Categorías recomendadas */}
      <CategoryGrid />

      {/* Banner principal a todo el ancho */}
      <section className="container mx-auto px-4 pb-2">
        <div className="h-[220px] sm:h-[300px] lg:h-[360px]">
          <HeroBanner />
        </div>
      </section>

      {/* Mosaico de categorías + calculadora (popup) */}
      <CategoryMosaic />

      <FeaturedProducts />
      <BrandSection />
    </>
  )
}
