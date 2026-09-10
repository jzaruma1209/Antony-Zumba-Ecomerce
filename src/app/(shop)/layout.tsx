import { Suspense } from "react"
import { TopBar } from "@/components/layout/TopBar"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat"
import { getCategories, getBestSellingProducts } from "@/lib/queries"

// Igual que en la home: refresco mínimo para no dejar categorías/menú
// congelados hasta el próximo deploy.
export const revalidate = 60

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Las dos consultas salen a la vez, no una detrás de otra
  const [categories, bestSellers] = await Promise.all([
    getCategories(),
    getBestSellingProducts(6),
  ])

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Suspense fallback={null}>
        <Header categories={categories} />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer products={bestSellers} />
      <WhatsAppFloat />
    </div>
  )
}
