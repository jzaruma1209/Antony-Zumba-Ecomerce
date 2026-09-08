import { HeroBanner } from "@/components/home/HeroBanner"
import { CategoryGrid } from "@/components/home/CategoryGrid"
import { CategoryMosaic } from "@/components/home/CategoryMosaic"
import { FlashOffers } from "@/components/home/FlashOffers"
import { FeaturedProducts } from "@/components/home/FeaturedProducts"
import { BrandSection } from "@/components/home/BrandSection"

export default function HomePage() {
  return (
    <>
      {/* Categorías recomendadas */}
      <CategoryGrid />

      {/* Banner principal full-bleed (todo el ancho de la pantalla) */}
      <section className="pb-1">
        <div className="h-[240px] sm:h-[320px] lg:h-[400px]">
          <HeroBanner />
        </div>
      </section>

      {/* Mosaico de categorías + calculadora (popup) */}
      <CategoryMosaic />

      {/* Ofertas flash: solo productos con descuento */}
      <FlashOffers />

      <FeaturedProducts />
      <BrandSection />
    </>
  )
}
