"use client"

import { useState, useEffect } from "react"
import {
  Search,
  FolderTree,
  RefreshCcw,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  Grid3x3,
  RectangleHorizontal,
  Building2,
  Lightbulb,
  Wrench,
  Layers,
  PanelTop,
  Frame,
  LayoutDashboard,
  Package,
} from "lucide-react"
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
import type { Category } from "@/types"

const CATEGORY_ICON_MAP: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Grid3x3,
  RectangleHorizontal,
  Building2,
  Lightbulb,
  Wrench,
  Layers,
  PanelTop,
  Frame,
  LayoutDashboard,
  Package,
}

interface SimpleProduct {
  id: string
  name: string
  slug: string
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState({ name: "", slug: "", icon: "" })
  const [saving, setSaving] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [catToDelete, setCatToDelete] = useState<Category | null>(null)
  const [associatedProducts, setAssociatedProducts] = useState<SimpleProduct[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/categories")
      if (!res.ok) throw new Error()
      setCategories(await res.json())
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCategories() }, [])

  const handleDeleteClick = async (cat: Category) => {
    setCatToDelete(cat)
    setDeleteOpen(true)
    if (cat.productCount > 0) {
      setLoadingProducts(true)
      try {
        const res = await fetch(`/api/products?category=${cat.slug}&limit=100`)
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
    if (!catToDelete) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/categories/${catToDelete.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      await fetchCategories()
      setDeleteOpen(false)
      setCatToDelete(null)
    } catch {
      // silent
    } finally {
      setDeleting(false)
    }
  }

  const openCreateDialog = () => {
    setCreateError(null)
    setForm({ name: "", slug: "", icon: "" })
    setCreateOpen(true)
  }

  const handleCreate = async () => {
    if (!form.name.trim() || !form.slug.trim()) return
    setSaving(true)
    setCreateError(null)
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setCreateError(data?.error || "Error al crear la categoría")
        return
      }

      await fetchCategories()
      setCreateOpen(false)
      setForm({ name: "", slug: "", icon: "" })
    } catch {
      setCreateError("No se pudo conectar con el servidor. Intenta nuevamente.")
    } finally {
      setSaving(false)
    }
  }

  const autoSlug = (name: string) =>
    name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const hasProducts = (catToDelete?.productCount ?? 0) > 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categorías</h1>
          <p className="text-muted-foreground text-sm mt-1">{categories.length} categorías registradas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchCategories} disabled={loading}>
            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} strokeWidth={1.75} />
            Actualizar
          </Button>
          <Button size="sm" onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" strokeWidth={1.75} />
            Nueva categoría
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total categorías</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-mono">{categories.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total productos activos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-mono">
              {categories.reduce((sum, c) => sum + c.productCount, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
        <Input
          placeholder="Buscar categoría..."
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
                <TableHead>Icono</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-right">Productos</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    Cargando categorías...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    <FolderTree className="h-8 w-8 mx-auto mb-2 opacity-40" strokeWidth={1.75} />
                    No se encontraron categorías
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((cat) => {
                  const IconComp = (cat.icon && CATEGORY_ICON_MAP[cat.icon]) || Package
                  return (
                    <TableRow key={cat.id}>
                      <TableCell>
                        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted/60 text-muted-foreground">
                          <IconComp className="h-4 w-4" strokeWidth={1.75} />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{cat.name}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">{cat.slug}</TableCell>
                      <TableCell className="text-right font-mono font-semibold">{cat.productCount}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
                            <Pencil className="h-4 w-4" strokeWidth={1.75} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteClick(cat)}
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete dialog */}
      <Dialog open={deleteOpen} onOpenChange={(open) => { if (!open) { setDeleteOpen(false); setCatToDelete(null); setAssociatedProducts([]) } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" strokeWidth={1.75} />
              Eliminar categoría
            </DialogTitle>
            <DialogDescription>
              {hasProducts
                ? `La categoría "${catToDelete?.name}" no se puede eliminar porque tiene productos asociados. Primero elimina o reasigna estos productos:`
                : `¿Estás seguro que deseas eliminar la categoría "${catToDelete?.name}"? Esta acción no se puede deshacer.`}
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
            <Button variant="outline" onClick={() => { setDeleteOpen(false); setCatToDelete(null); setAssociatedProducts([]) }}>
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
      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open)
          if (!open) setCreateError(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva categoría</DialogTitle>
            <DialogDescription>
              Ingresa los datos para registrar una nueva categoría de productos en la tienda.
            </DialogDescription>
          </DialogHeader>

          {createError && (
            <div className="flex items-start gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" strokeWidth={1.75} />
              <span>{createError}</span>
            </div>
          )}

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Nombre</Label>
              <Input
                id="cat-name"
                placeholder="Ej: Gypsum"
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value
                  setCreateError(null)
                  setForm((f) => ({ ...f, name, slug: autoSlug(name) }))
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-slug">Slug</Label>
              <Input
                id="cat-slug"
                placeholder="Ej: gypsum"
                value={form.slug}
                onChange={(e) => {
                  setCreateError(null)
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-icon">Icono (Nombre de icono Lucide)</Label>
              <Input
                id="cat-icon"
                placeholder="Ej: Building2, Layers, Package, Frame..."
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateOpen(false)
                setCreateError(null)
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={saving || !form.name || !form.slug}>
              {saving ? "Guardando..." : "Crear categoría"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
