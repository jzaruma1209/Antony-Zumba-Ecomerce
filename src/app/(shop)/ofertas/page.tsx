"use client"

import { Suspense, useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { FilterSidebar } from "@/components/products/FilterSidebar"
import { FilterMobile } from "@/components/products/FilterMobile"
import { ProductGrid } from "@/components/products/ProductGrid"
import { SortSelect } from "@/components/products/SortSelect"
import { Skeleton } from "@/components/ui/skeleton"
import { useProductsStore } from "@/stores/products-store"
import { FilterState } from "@/types"
import { Tag } from "lucide-react"

function OffersContent() {
  const searchParams = useSearchParams()
  const { products, loading, filters, setFilters, fetchProducts, fetchCategories, fetchBrands } = useProductsStore()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Initialize filters from URL params with offersOnly = true
  useEffect(() => {
    const category = searchParams.get("category")
    const brand = searchParams.get("brand")

    const initialFilters: Partial<FilterState> = {
      offersOnly: true,
    }
    if (category) {
      initialFilters.categories = [category]
    }
    if (brand) {
      initialFilters.brands = [brand]
    }

    setFilters(initialFilters)
    fetchCategories()
    fetchBrands()
  }, [searchParams, setFilters, fetchCategories, fetchBrands])

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts({ offersOnly: true })
  }, [filters, fetchProducts])

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters({ ...newFilters, offersOnly: true })
  }, [setFilters])

  const activeFilterCount =
    filters.brands.length +
    filters.categories.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000 ? 1 : 0)

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Productos</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Ofertas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Results count and controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Productos de Oferta</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-orange/10 px-2.5 py-0.5 text-xs font-semibold text-brand-orange">
              <Tag className="h-3.5 w-3.5" strokeWidth={1.75} />
              Descuentos
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? "Cargando..." : `${products.length} productos en oferta encontrados`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <FilterMobile
            filters={filters}
            onFiltersChange={handleFiltersChange}
            activeFilterCount={activeFilterCount}
          />
          <SortSelect
            value={filters.sortBy}
            onChange={(sortBy) =>
              setFilters({ sortBy: sortBy as FilterState["sortBy"] })
            }
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex gap-8">
        {/* Sidebar - Desktop */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">
            <FilterSidebar filters={filters} onFiltersChange={handleFiltersChange} />
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <ProductGrid
            products={products}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}

function OffersPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Skeleton className="mb-6 h-6 w-48" />
      <div className="mb-6 flex justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-32" />
        </div>
      </div>
      <div className="flex gap-8">
        <aside className="hidden w-64 lg:block">
          <Skeleton className="h-96" />
        </aside>
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OffersPage() {
  return (
    <Suspense fallback={<OffersPageSkeleton />}>
      <OffersContent />
    </Suspense>
  )
}
