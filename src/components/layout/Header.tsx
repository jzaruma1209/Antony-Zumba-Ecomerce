"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Search, ShoppingCart, Heart, User, LogOut, Settings, Package, ChevronDown, X } from "lucide-react"
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
import type { Category } from "@/types"

export function Header({ categories = [] }: { categories?: Category[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const mobileInputRef = useRef<HTMLInputElement>(null)
  const lastScrollY = useRef(0)
  const itemCount = useCartStore((state) => state.getItemCount())
  const favoriteCount = useFavoritesStore((state) => state.getItemCount())
  const { data: session, status } = useSession()

  // Sincronizar el input si ya hay un query en la URL
  useEffect(() => {
    const q = searchParams.get("search")
    if (q) {
      setSearchQuery(q)
    } else {
      setSearchQuery("")
    }
  }, [searchParams])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    if (trimmed) {
      router.push(`/products?search=${encodeURIComponent(trimmed)}`)
    } else {
      router.push("/products")
    }
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    if (searchParams.get("search")) {
      router.push("/products")
    }
  }

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen((prev) => {
      const next = !prev
      if (next) {
        setTimeout(() => mobileInputRef.current?.focus(), 100)
      }
      return next
    })
  }

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
        <div className="flex h-12 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0" aria-label="TumbadosZumba">
            <Image
              src="/iconozumba.png"
              alt="TumbadosZumba"
              width={40}
              height={40}
              className="h-8 w-8 rounded-lg object-contain transition-transform hover:scale-105"
              priority
            />
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden flex-1 max-w-2xl md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos, materiales, acabados..."
                className="w-full pl-10 pr-9 h-8 text-sm bg-muted/40 hover:bg-muted/60 focus-visible:bg-background transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="h-4 w-4" strokeWidth={1.75} />
                </button>
              )}
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search - Mobile Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 md:hidden"
              onClick={toggleMobileSearch}
              aria-label="Alternar barra de búsqueda"
            >
              <Search className="h-4 w-4" strokeWidth={1.75} />
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
              <Button variant="ghost" size="icon" className="relative h-8 w-8">
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
              <Button variant="ghost" size="icon" className="relative h-8 w-8">
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
                      <Button variant="ghost" className="hidden h-8 gap-1 px-2 sm:flex">
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
            <MobileNav categories={categories} />
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className={`pb-3 md:hidden transition-all duration-200 ${isMobileSearchOpen ? "block" : "hidden"}`}>
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
            <Input
              ref={mobileInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos, materiales..."
              className="w-full pl-10 pr-9"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            )}
          </form>
        </div>

        {/* Sub-header Navigation Bar (Estilo Lowe's) */}
        <div className="hidden border-t border-border/40 py-2 md:flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 overflow-x-auto gap-4 scrollbar-none">
          <div className="flex items-center gap-4 shrink-0">
            {/* Ver Categorías Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white hover:text-primary transition-colors py-0.5 px-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Package className="h-4 w-4 text-primary" strokeWidth={1.75} />
                  <span>Ver categorías</span>
                  <ChevronDown className="h-3 w-3 text-slate-500" strokeWidth={1.75} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-60 max-h-[420px] overflow-y-auto">
                <DropdownMenuLabel className="text-xs font-bold text-slate-500">
                  Categorías
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {categories.length === 0 ? (
                  <div className="py-3 px-3 text-xs text-muted-foreground text-center">
                    Cargando categorías...
                  </div>
                ) : (
                  categories.map((category) => (
                    <DropdownMenuItem key={category.id || category.slug} asChild>
                      <Link
                        href={`/products?category=${category.slug}`}
                        className="cursor-pointer font-medium flex items-center justify-between"
                      >
                        <span className="truncate">{category.name}</span>
                        {category.productCount !== undefined && category.productCount > 0 && (
                          <span className="text-[10px] text-muted-foreground ml-2 font-mono">
                            {category.productCount}
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/products"
                    className="cursor-pointer font-semibold text-primary justify-center text-xs"
                  >
                    Ver todos los productos
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Links con iconos */}
            <Link href="/instalaciones" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">
              <Settings className="h-3.5 w-3.5 text-slate-500" strokeWidth={1.75} />
              <span>Instalaciones</span>
            </Link>

            <Link href="/ofertas" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">
              <Heart className="h-3.5 w-3.5 text-slate-500" strokeWidth={1.75} />
              <span>Ofertas</span>
            </Link>

            <Link href="/diseno-e-ideas" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">
              <User className="h-3.5 w-3.5 text-slate-500" strokeWidth={1.75} />
              <span className="font-semibold text-slate-900 dark:text-white">Diseño e ideas+</span>
              <span className="rounded-full bg-red-600 px-1.5 py-0.2 text-[10px] font-bold text-white uppercase">
                Nuevo
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

