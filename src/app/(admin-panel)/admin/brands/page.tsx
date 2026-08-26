"use client"

import { useState, useEffect } from "react"
import { Search, Tag, RefreshCcw, Plus, Pencil, Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import type { Brand } from "@/types"

interface SimpleProduct {
  id: string
  name: string
  slug: string
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState({ name: "", slug: "", logo: "" })
  const [saving, setSaving] = useState(false)

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null)
  const [associatedProducts, setAssociatedProducts] = useState<SimpleProduct[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchBrands = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/brands")
      if (!res.ok) throw new Error()
      setBrands(await res.json())
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBrands() }, [])

  // Click trash → load associated products → open popup
  const handleDeleteClick = async (brand: Brand) => {
    setBrandToDelete(brand)
    setDeleteOpen(true)
    if (brand.productCount > 0) {
      setLoadingProducts(true)
      try {
        const res = await fetch(`/api/products?brand=${brand.slug}&limit=100`)
        if (!res.ok) throw new Error()
        const data = await res.json()
        // API returns { products: [...], total } 
        setAssociatedProducts(Array.isArray(data) ? data : (data.products ?? []))
      } catch {
        setAssociatedProducts([])
      } finally {
        setLoadingProducts(false)
      }
    } else {
      setAssociatedProducts([])
    }
  }

  const handleConfirmDelete = async () => {
    if (!brandToDelete) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/brands/${brandToDelete.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      await fetchBrands()
      setDeleteOpen(false)
      setBrandToDelete(null)
    } catch {
      // silent
    } finally {
      setDeleting(false)
    }
  }

  const handleCreate = async () => {
    if (!form.name || !form.slug) return
    setSaving(true)
    try {
      const res = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      await fetchBrands()
      setCreateOpen(false)
      setForm({ name: "", slug: "", logo: "" })
    } catch {
      // silent
    } finally {
      setSaving(false)
    }
  }

  const autoSlug = (name: string) =>
    name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const hasProducts = (brandToDelete?.productCount ?? 0) > 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marcas</h1>
          <p className="text-muted-foreground text-sm mt-1">{brands.length} marcas registradas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchBrands} disabled={loading}>
            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} strokeWidth={1.75} />
            Actualizar
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" strokeWidth={1.75} />
            Nueva marca
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total marcas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-mono">{brands.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total productos activos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-mono">
              {brands.reduce((sum, b) => sum + b.productCount, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
        <Input
          placeholder="Buscar marca..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-right">Productos</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && brands.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    Cargando marcas...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    <Tag className="h-8 w-8 mx-auto mb-2 opacity-40" strokeWidth={1.75} />
                    No se encontraron marcas
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell className="font-medium">{brand.name}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">{brand.slug}</TableCell>
                    <TableCell className="text-right font-mono font-semibold">{brand.productCount}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
                          <Pencil className="h-4 w-4" strokeWidth={1.75} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(brand)}
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete dialog */}
      <Dialog open={deleteOpen} onOpenChange={(open) => { if (!open) { setDeleteOpen(false); setBrandToDelete(null); setAssociatedProducts([]) } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" strokeWidth={1.75} />
              Eliminar marca
            </DialogTitle>
            <DialogDescription>
              {hasProducts
                ? `La marca "${brandToDelete?.name}" no se puede eliminar porque tiene productos asociados. Primero elimina o reasigna estos productos:`
                : `¿Estás seguro que deseas eliminar la marca "${brandToDelete?.name}"? Esta acción no se puede deshacer.`}
            </DialogDescription>
          </DialogHeader>

          {hasProducts && (
            <div className="border rounded-md max-h-52 overflow-y-auto">
              {loadingProducts ? (
                <p className="text-sm text-muted-foreground text-center py-4">Cargando productos...</p>
              ) : (
                <ul className="divide-y text-sm">
                  {associatedProducts.map((p) => (
                    <li key={p.id} className="px-4 py-2 font-medium">
                      {p.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteOpen(false); setBrandToDelete(null); setAssociatedProducts([]) }}>
              Cancelar
            </Button>
            {!hasProducts && (
              <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleting}>
                {deleting ? "Eliminando..." : "Sí, eliminar"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva marca</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="brand-name">Nombre</Label>
              <Input
                id="brand-name"
                placeholder="Ej: Gyplac"
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value
                  setForm((f) => ({ ...f, name, slug: autoSlug(name) }))
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand-slug">Slug</Label>
              <Input
                id="brand-slug"
                placeholder="Ej: gyplac"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand-logo">Logo URL (opcional)</Label>
              <Input
                id="brand-logo"
                placeholder="https://..."
                value={form.logo}
                onChange={(e) => setForm((f) => ({ ...f, logo: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={saving || !form.name || !form.slug}>
              {saving ? "Guardando..." : "Crear marca"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
