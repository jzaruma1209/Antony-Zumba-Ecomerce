import { HeroBanner } from "@/components/home/HeroBanner"
import { DynamicCalculatorSection } from "@/components/home/DynamicCalculatorSection"
import { CategoryGrid } from "@/components/home/CategoryGrid"
import { FeaturedProducts } from "@/components/home/FeaturedProducts"
import { BrandSection } from "@/components/home/BrandSection"

export default function HomePage() {
  return (
    <>
      {/* Categorías recomendadas */}
      <CategoryGrid />

      {/* Hero: Calculadora (~25%) + Banner (~75%) */}
      <section className="container mx-auto px-4 pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 items-stretch">
          {/* Calculadora */}
          <div className="lg:col-span-3 h-[320px] lg:h-auto">
            <DynamicCalculatorSection />
          </div>

          {/* Banner Principal */}
          <div className="lg:col-span-9 h-[320px] lg:h-auto">
            <HeroBanner />
          </div>
        </div>
      </section>


      <FeaturedProducts />
      <BrandSection />
    </>
  )
}
