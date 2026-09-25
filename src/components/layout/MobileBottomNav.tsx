"use client"

import { useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Store, ShoppingCart, Tag, Menu } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { MobileNav } from "./MobileNav"
import { useCartStore } from "@/stores/cart-store"
import { cn } from "@/lib/utils"
import type { Category } from "@/types"

const tabs = [
  { name: "Inicio", href: "/", icon: Home, match: (p: string) => p === "/" },
  { name: "Catálogo", href: "/products", icon: Store, match: (p: string) => p.startsWith("/products") },
  { name: "Carrito", href: "/cart", icon: ShoppingCart, match: (p: string) => p.startsWith("/cart") },
  { name: "Ofertas", href: "/ofertas", icon: Tag, match: (p: string) => p.startsWith("/ofertas") },
]

const noopSubscribe = () => () => {}

// Barra de navegación fija abajo, solo en celular (estilo app)
export function MobileBottomNav({ categories = [] }: { categories?: Category[] }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const itemCount = useCartStore((state) => state.getItemCount())
  // false en el servidor, true en el cliente: evita el desfase de hidratación del carrito persistido
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false)

  return (
    <>
      <nav
        aria-label="Navegación principal"
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pb-[env(safe-area-inset-bottom)] md:hidden print:hidden"
      >
        <div className="grid h-16 grid-cols-5">
          {tabs.map((tab) => {
            const isActive = !menuOpen && tab.match(pathname)
            const isCart = tab.href === "/cart"
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="relative">
                  <tab.icon className="h-5 w-5" strokeWidth={1.75} />
                  {isCart && mounted && itemCount > 0 && (
                    <Badge
                      className="absolute -right-2.5 -top-2 h-4 min-w-4 rounded-full px-1 text-[10px] flex items-center justify-center"
                      variant="destructive"
                    >
                      {itemCount > 99 ? "99+" : itemCount}
                    </Badge>
                  )}
                </span>
                {tab.name}
              </Link>
            )
          })}

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
              menuOpen ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Menu className="h-5 w-5" strokeWidth={1.75} />
            Menú
          </button>
        </div>
      </nav>

      <MobileNav categories={categories} open={menuOpen} onOpenChange={setMenuOpen} />
    </>
  )
}
