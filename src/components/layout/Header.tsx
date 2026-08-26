"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Search, ShoppingCart, Heart, User, LogOut, Settings, Package, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "./ThemeToggle"
import { MobileNav } from "./MobileNav"
import { useCartStore } from "@/stores/cart-store"
import { useFavoritesStore } from "@/stores/favorites-store"

export function Header() {
  const [mounted, setMounted] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const lastScrollY = useRef(0)
  const itemCount = useCartStore((state) => state.getItemCount())
  const favoriteCount = useFavoritesStore((state) => state.getItemCount())
  const { data: session, status } = useSession()

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    // Only hide after scrolling down past 100px
    if (currentScrollY > 100 && currentScrollY > lastScrollY.current) {
      setIsHidden(true)
    } else {
      setIsHidden(false)
    }
    lastScrollY.current = currentScrollY
  }, [])

  useEffect(() => {
    setMounted(true)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ease-in-out ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0" aria-label="TumbadosZumba">
            <Image
              src="/iconozumba.png"
              alt="TumbadosZumba"
              width={40}
              height={40}
              className="h-10 w-10 rounded-lg object-contain transition-transform hover:scale-105"
              priority
            />
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden flex-1 max-w-2xl md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
              <Input
                type="search"
                placeholder="Buscar productos, materiales, acabados..."
                className="w-full pl-10 pr-4 h-10 bg-muted/40 hover:bg-muted/60 focus-visible:bg-background transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search - Mobile */}
            <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden">
              <Search className="h-4 w-4" />
              <span className="sr-only">Buscar</span>
            </Button>

            {/* Products Link */}
            <Link href="/products" className="hidden md:block">
              <Button variant="ghost" size="sm" className="font-semibold">
                PRODUCTOS
              </Button>
            </Link>

            <ThemeToggle />

            <Link href="/profile/favorites">
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Heart className="h-4 w-4" />
                {mounted && favoriteCount > 0 && (
                  <Badge
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-red-500 text-white"
                  >
                    {favoriteCount > 99 ? "99+" : favoriteCount}
                  </Badge>
                )}
                <span className="sr-only">Favoritos</span>
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <ShoppingCart className="h-4 w-4" />
                {mounted && itemCount > 0 && (
                  <Badge
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                    variant="destructive"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </Badge>
                )}
                <span className="sr-only">Carrito</span>
              </Button>
            </Link>

            {/* Auth Section */}
            {mounted && status !== "loading" && (
              <>
                {session ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="hidden h-9 gap-1 px-2 sm:flex">
                        <User className="h-4 w-4" />
                        <span className="max-w-24 truncate text-sm">
                          {session.user?.name?.split(" ")[0]}
                        </span>
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col">
                          <span className="font-medium">{session.user?.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {session.user?.email}
                          </span>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Mi Perfil
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile/orders" className="cursor-pointer">
                          <Package className="mr-2 h-4 w-4" />
                          Mis Pedidos
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile/settings" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Configuración
                        </Link>
                      </DropdownMenuItem>
                      {session.user?.role === "ADMIN" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href="/admin" className="cursor-pointer">
                              <Settings className="mr-2 h-4 w-4" />
                              Panel Admin
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar Sesión
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="hidden items-center gap-2 sm:flex">
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        Ingresar
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm">
                        Registrarse
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Mobile Menu */}
            <MobileNav />
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="pb-3 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar productos..."
              className="w-full pl-10 pr-4"
            />
          </div>
        </div>

        {/* Sub-header Navigation Bar (Estilo Lowe's) */}
        <div className="hidden border-t border-border/40 py-2 md:flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 overflow-x-auto gap-4 scrollbar-none">
          <div className="flex items-center gap-4 shrink-0">
            {/* Ver Todo Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white hover:text-primary transition-colors py-0.5 px-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Package className="h-4 w-4 text-primary" />

                  <span>Ver todo</span>
                  <ChevronDown className="h-3 w-3 text-slate-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel className="text-xs font-bold text-slate-500">
                  Departamentos
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/products?category=gypsum" className="cursor-pointer font-medium">
                    Gypsum & Planchas
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products?category=wpc" className="cursor-pointer font-medium">
                    Paneles WPC Decorativos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products?category=marmol-pvc" className="cursor-pointer font-medium">
                    Láminas Mármol PVC
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products?category=duelas-pvc" className="cursor-pointer font-medium">
                    Duelas de PVC
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products?category=cielo-raso" className="cursor-pointer font-medium">
                    Cielos Rasos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products?category=iluminacion-led" className="cursor-pointer font-medium">
                    Iluminación LED
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products?category=molduras" className="cursor-pointer font-medium">
                    Molduras & Acabados
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products?category=insumos" className="cursor-pointer font-medium">
                    Insumos & Perfilería
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Links con iconos */}
            <Link href="/instalaciones" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">
              <Settings className="h-3.5 w-3.5 text-slate-500" />
              <span>Instalaciones</span>
            </Link>

            <Link href="/ofertas" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">
              <Heart className="h-3.5 w-3.5 text-slate-500" />
              <span>Ofertas</span>
            </Link>

            <Link href="/diseno-e-ideas" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">
              <User className="h-3.5 w-3.5 text-slate-500" />
              <span className="font-semibold text-slate-900 dark:text-white">Diseño e ideas+</span>
              <span className="rounded-full bg-red-600 px-1.5 py-0.2 text-[10px] font-bold text-white uppercase">
                Nuevo
              </span>
            </Link>

            <div className="h-3.5 w-px bg-border/60 mx-1" />
          </div>

          {/* Categorías secundarias */}
          <div className="flex items-center gap-4 shrink-0 text-slate-600 dark:text-slate-400">
            <Link href="/products?category=insumos" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Accesorios
            </Link>
            <Link href="/products?category=duelas-pvc" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Baño
            </Link>
            <Link href="/products?category=gypsum" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Materiales de construcción
            </Link>
            <Link href="/products?category=molduras" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Puertas y ventanas
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

