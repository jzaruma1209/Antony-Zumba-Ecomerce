import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { transformProduct } from "@/lib/transformers"
import { cloudinary } from "@/lib/cloudinary"

type Params = Promise<{ id: string }>

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params

    // Try to find by slug first, then by id
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ slug: id }, { id: id }],
      },
      include: {
        category: true,
        brand: true,
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(transformProduct(product))
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Error fetching product" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        comparePrice: body.comparePrice ? Number(body.comparePrice) : null,
        stock: body.stock,
        images: body.images,
        specs: body.specs,
        isNew: body.isNew,
        isFeatured: body.isFeatured,
        freeShipping: body.freeShipping !== undefined ? body.freeShipping : false,
        returnPolicy: body.returnPolicy !== undefined ? body.returnPolicy : false,
        returnDays: body.returnPolicy && body.returnDays ? Number(body.returnDays) : null,
        warranty: body.warranty !== undefined ? body.warranty : false,
        warrantyPeriod: body.warranty && body.warrantyPeriod ? String(body.warrantyPeriod) : null,
        isActive: body.isActive !== undefined ? body.isActive : true,
        categoryId: body.categoryId,
        brandId: body.brandId,
      },
      include: {
        category: true,
        brand: true,
      },
    })

    return NextResponse.json(transformProduct(product))
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      { error: "Error updating product" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params

    // 1. Obtener el producto con sus imágenes antes de eliminarlo
    const product = await prisma.product.findUnique({
      where: { id },
      select: { images: true },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // 2. Eliminar imágenes de Cloudinary si existen
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map(async (imageUrl) => {
        try {
          // Extraer el public_id de la URL de Cloudinary
          // Formato: https://res.cloudinary.com/<cloud>/image/upload/v<version>/<public_id>.<ext>
          const match = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/)
          if (match && match[1]) {
            const publicId = match[1]
            await cloudinary.uploader.destroy(publicId)
          }
        } catch (cloudinaryError) {
          // Loggear error pero no interrumpir la eliminación del producto
          console.error(`Error eliminando imagen de Cloudinary: ${imageUrl}`, cloudinaryError)
        }
      })

      await Promise.all(deletePromises)
    }

    // 3. Eliminar el producto de la base de datos
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { error: "Error deleting product" },
      { status: 500 }
    )
  }
}
