import { Suspense } from "react"
import { TopBar } from "@/components/layout/TopBar"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat"

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
