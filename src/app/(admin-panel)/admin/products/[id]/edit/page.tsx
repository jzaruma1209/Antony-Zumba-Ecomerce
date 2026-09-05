"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ImageUpload } from "@/components/admin/ImageUpload"
import type { Product } from "@/types"

interface UploadedImage {
  url: string
  publicId: string
}

const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  slug: z.string().min(1, "El slug es requerido"),
  description: z.string().min(1, "La descripcion es requerida"),
  price: z.number({ error: "El precio es requerido" }).min(0, "El precio debe ser mayor a 0"),
  comparePrice: z.number().min(0, "El precio anterior debe ser mayor o igual a 0").optional(),
  stock: z.number({ error: "El stock es requerido" }).min(0, "El stock debe ser mayor o igual a 0"),
  categoryId: z.string().min(1, "La categoria es requerida"),
  brandId: z.string().min(1, "La marca es requerida"),
  isNew: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  freeShipping: z.boolean().default(false),
  returnPolicy: z.boolean().default(false),
  returnDays: z.number().nullable().optional(),
  warranty: z.boolean().default(false),
  warrantyPeriod: z.string().nullable().optional(),
})

type ProductFormData = z.infer<typeof productSchema>

interface Category {
  id: string
  name: string
  slug: string
}

interface Brand {
  id: string
  name: string
  slug: string
}

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState<UploadedImage[]>([])
  const [isOffer, setIsOffer] = useState(false)
  const [showOfferAlert, setShowOfferAlert] = useState(false)
  const [warrantyOption, setWarrantyOption] = useState<string>("1-mes")
  const [customWarranty, setCustomWarranty] = useState<string>("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isNew: false,
      isFeatured: false,
      freeShipping: false,
      returnPolicy: false,
      returnDays: 30,
      warranty: false,
      warrantyPeriod: "1 mes",
      stock: 0,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, brandsRes, productRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/brands"),
          fetch(`/api/products/${id}`),
        ])

        const categoriesData: Category[] = await categoriesRes.json()
        const brandsData: Brand[] = await brandsRes.json()
        const productData: Product = await productRes.json()

        setCategories(categoriesData || [])
        setBrands(brandsData || [])

        if (productData && !("error" in productData)) {
          // Determinar opción de garantía si ya viene cargada
          let wOpt = "1-mes"
          let cW = ""
          if (productData.warrantyPeriod) {
            const wp = productData.warrantyPeriod.trim().toLowerCase()
            if (wp === "1 mes") wOpt = "1-mes"
            else if (wp === "3 meses") wOpt = "3-meses"
            else if (wp === "6 meses") wOpt = "6-meses"
            else if (wp === "1 año" || wp === "1 ano" || wp === "12 meses") wOpt = "12-meses"
            else {
              wOpt = "custom"
              cW = productData.warrantyPeriod
            }
          }
          setWarrantyOption(wOpt)
          setCustomWarranty(cW)

          reset({
            name: productData.name,
            slug: productData.slug,
            description: productData.description || "",
            price: productData.price,
            comparePrice: productData.originalPrice,
            stock: productData.stock,
            categoryId: productData.categoryId || categoriesData.find(c => c.slug === productData.category)?.id || "",
            brandId: productData.brandId || brandsData.find(b => b.name === productData.brand)?.id || "",
            isNew: productData.isNew || false,
            isFeatured: productData.isFeatured || false,
            freeShipping: productData.freeShipping ?? false,
            returnPolicy: productData.returnPolicy ?? false,
            returnDays: productData.returnDays ?? 30,
            warranty: productData.warranty ?? false,
            warrantyPeriod: productData.warrantyPeriod ?? "1 mes",
          })

          // Inicializar isOffer si el producto ya tiene precio anterior
          if (productData.originalPrice && productData.originalPrice > 0) {
            setIsOffer(true)
          }

          if (productData.images && productData.images.length > 0) {
            setImages(
              productData.images.map((url, index) => ({
                url,
                publicId: `img-${index}`,
              }))
            )
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, reset])

  const handleOfferToggle = (checked: boolean) => {
    if (checked) {
      const comparePrice = watch("comparePrice")
      if (!comparePrice || Number(comparePrice) <= 0) {
        setShowOfferAlert(true)
        return
      }
      setIsOffer(true)
    } else {
      setIsOffer(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const onSubmit = async (data: ProductFormData) => {
    if (images.length === 0) {
      alert("Debes subir al menos una imagen")
      return
    }

    if (isOffer && (!data.comparePrice || Number(data.comparePrice) <= 0)) {
      setShowOfferAlert(true)
      return
    }

    const returnPolicy = watch("returnPolicy")
    const warranty = watch("warranty")

    setSaving(true)
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          freeShipping: !!data.freeShipping,
          returnPolicy: !!returnPolicy,
          returnDays: returnPolicy ? Number(data.returnDays) || 30 : null,
          warranty: !!warranty,
          warrantyPeriod: warranty
            ? warrantyOption === "custom"
              ? customWarranty
              : warrantyOption === "1-mes"
              ? "1 mes"
              : warrantyOption === "3-meses"
              ? "3 meses"
              : warrantyOption === "6-meses"
              ? "6 meses"
              : warrantyOption === "12-meses"
              ? "1 año"
              : customWarranty || "1 mes"
            : null,
          comparePrice: isOffer && data.comparePrice ? data.comparePrice : null,
          images: images.map((img) => img.url),
        }),
      })

      if (!response.ok) throw new Error("Error updating product")

      router.push("/admin/products")
    } catch (error) {
      console.error("Error updating product:", error)
      alert("Error al actualizar el producto")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Editar Producto</h1>
          <p className="text-muted-foreground">
            Modifica la información y detalles del producto
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
            <CardDescription>
              Datos principales del producto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  placeholder="Nombre del producto"
                  {...register("name", {
                    onChange: (e) => {
                      setValue("slug", generateSlug(e.target.value))
                    },
                  })}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  placeholder="nombre-del-producto"
                  {...register("slug")}
                />
                {errors.slug && (
                  <p className="text-sm text-destructive">{errors.slug.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Descripción detallada del producto"
                rows={4}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="categoryId">Categoría</Label>
                <Select
                  value={watch("categoryId")}
                  onValueChange={(value) => setValue("categoryId", value)}
                >
                  <SelectTrigger id="categoryId">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-sm text-destructive">{errors.categoryId.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="brandId">Marca</Label>
                <Select
                  value={watch("brandId")}
                  onValueChange={(value) => setValue("brandId", value)}
                >
                  <SelectTrigger id="brandId">
                    <SelectValue placeholder="Seleccionar marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.brandId && (
                  <p className="text-sm text-destructive">{errors.brandId.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Precio e Inventario</CardTitle>
            <CardDescription>
              Configura precio y disponibilidad
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">Precio ($ USD)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="comparePrice">Precio anterior (opcional)</Label>
                <Input
                  id="comparePrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("comparePrice", {
                    setValueAs: (v) => (v === "" || v === null || v === undefined || Number.isNaN(Number(v)) ? undefined : Number(v)),
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="0"
                  {...register("stock", { valueAsNumber: true })}
                />
                {errors.stock && (
                  <p className="text-sm text-destructive">{errors.stock.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Imágenes</CardTitle>
            <CardDescription>
              Gestiona las imágenes del producto (máximo 5)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              value={images}
              onChange={setImages}
              maxImages={5}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Opciones</CardTitle>
            <CardDescription>
              Configuraciones adicionales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isNew"
                checked={watch("isNew")}
                onCheckedChange={(checked) => setValue("isNew", !!checked)}
              />
              <Label htmlFor="isNew" className="font-normal">
                Marcar como producto nuevo
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isFeatured"
                checked={watch("isFeatured")}
                onCheckedChange={(checked) => setValue("isFeatured", !!checked)}
              />
              <Label htmlFor="isFeatured" className="font-normal">
                Mostrar en productos destacados
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isOffer"
                checked={isOffer}
                onCheckedChange={handleOfferToggle}
              />
              <Label htmlFor="isOffer" className="font-normal cursor-pointer">
                Marcar producto en oferta
              </Label>
            </div>

            <div className="border-t pt-4 space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Envíos, Devoluciones y Garantía</h4>

              {/* Envío Gratis */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="freeShipping"
                  checked={watch("freeShipping")}
                  onCheckedChange={(checked) => setValue("freeShipping", !!checked)}
                />
                <Label htmlFor="freeShipping" className="font-normal cursor-pointer">
                  Aplica Envío Gratis
                </Label>
              </div>

              {/* Devoluciones */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="returnPolicy"
                    checked={watch("returnPolicy")}
                    onCheckedChange={(checked) => setValue("returnPolicy", !!checked)}
                  />
                  <Label htmlFor="returnPolicy" className="font-normal cursor-pointer">
                    Aplica Devoluciones
                  </Label>
                </div>
                {watch("returnPolicy") && (
                  <div className="ml-6 flex items-center gap-2 max-w-xs">
                    <Input
                      id="returnDays"
                      type="number"
                      min={1}
                      placeholder="Días"
                      className="w-24"
                      {...register("returnDays", { valueAsNumber: true })}
                    />
                    <span className="text-sm text-muted-foreground">días para devolver</span>
                  </div>
                )}
              </div>

              {/* Garantía */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="warranty"
                    checked={watch("warranty")}
                    onCheckedChange={(checked) => setValue("warranty", !!checked)}
                  />
                  <Label htmlFor="warranty" className="font-normal cursor-pointer">
                    Aplica Garantía
                  </Label>
                </div>
                {watch("warranty") && (
                  <div className="ml-6 space-y-2 max-w-sm">
                    <Select
                      value={warrantyOption}
                      onValueChange={(val) => {
                        setWarrantyOption(val)
                        if (val === "1-mes") setValue("warrantyPeriod", "1 mes")
                        else if (val === "3-meses") setValue("warrantyPeriod", "3 meses")
                        else if (val === "6-meses") setValue("warrantyPeriod", "6 meses")
                        else if (val === "12-meses") setValue("warrantyPeriod", "1 año")
                      }}
                    >
                      <SelectTrigger id="warrantyPeriodSelect">
                        <SelectValue placeholder="Seleccionar tiempo de garantía" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-mes">1 mes</SelectItem>
                        <SelectItem value="3-meses">3 meses</SelectItem>
                        <SelectItem value="6-meses">6 meses</SelectItem>
                        <SelectItem value="12-meses">1 año (12 meses)</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                    {warrantyOption === "custom" && (
                      <Input
                        placeholder="Ej. 2 años, 18 meses, 5 años..."
                        value={customWarranty}
                        onChange={(e) => {
                          setCustomWarranty(e.target.value)
                          setValue("warrantyPeriod", e.target.value)
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/products">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando cambios...
              </>
            ) : (
              "Actualizar Producto"
            )}
          </Button>
        </div>
      </form>

      {/* Alerta si intenta marcar oferta sin precio anterior */}
      <AlertDialog open={showOfferAlert} onOpenChange={setShowOfferAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Precio anterior requerido</AlertDialogTitle>
            <AlertDialogDescription>
              Debes poner un precio anterior mayor a 0 en la sección de &quot;Precio e Inventario&quot; para poder marcar esta opción.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowOfferAlert(false)
                setTimeout(() => {
                  const input = document.getElementById("comparePrice")
                  input?.focus()
                }, 100)
              }}
            >
              Ingresar precio anterior
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
