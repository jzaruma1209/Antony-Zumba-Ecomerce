"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, User, Heart, Package, Building2, PanelTop, Layers, Grid3x3, Frame, LayoutDashboard, Lightbulb, RectangleHorizontal, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

import { useProductsStore } from "@/stores/products-store"

const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Building2,
  PanelTop,
  Layers,
  Grid3x3,
  Frame,
  LayoutDashboard,
  Lightbulb,
  RectangleHorizontal,
  Wrench,
  Package,
}

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const { categories } = useProductsStore()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden">
          <Menu className="h-4 w-4" strokeWidth={1.75} />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-4">
          {/* User Actions */}
          <div className="flex flex-col gap-2">
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              <User className="h-4 w-4" strokeWidth={1.75} />
              Mi Cuenta
            </Link>
            <Link
              href="/favorites"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              <Heart className="h-4 w-4" strokeWidth={1.75} />
              Favoritos
            </Link>
            <Link
              href="/orders"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              <Package className="h-4 w-4" strokeWidth={1.75} />
              Mis Pedidos
            </Link>
          </div>

          <Separator />

          {/* Categories */}
          <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto">
            <p className="px-3 text-xs font-semibold uppercase text-muted-foreground mb-1">
              Categorías
            </p>
            {categories.length === 0 ? (
              <p className="px-3 py-2 text-xs text-muted-foreground">Cargando categorías...</p>
            ) : (
              categories.map((category) => {
                const IconComponent = (category.icon && iconMap[category.icon]) || Package
                return (
                  <Link
                    key={category.id || category.slug}
                    href={`/products?category=${category.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-4 w-4" strokeWidth={1.75} />
                      <span>{category.name}</span>
                    </div>
                    {category.productCount !== undefined && category.productCount > 0 && (
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {category.productCount}
                      </span>
                    )}
                  </Link>
                )
              })
            )}
          </div>

          <Separator />

          {/* All Products & Offers */}
          <div className="flex flex-col gap-2">
            <Link
              href="/ofertas"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
            >
              <Heart className="h-4 w-4" strokeWidth={1.75} />
              Ver Productos en Oferta
            </Link>
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Ver Todos los Productos
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
