import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getBestSellingProducts } from "@/lib/queries"
import { transformProduct, transformCategory } from "@/lib/transformers"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get("q")?.trim()

    // Si no hay query, devolvemos los productos más buscados/vendidos y categorías populares
    if (!q) {
      const [topProducts, topCategories] = await Promise.all([
        getBestSellingProducts(6),
        prisma.category.findMany({
          include: {
            _count: {
              select: { products: { where: { isActive: true, stock: { gt: 0 } } } },
            },
          },
          take: 6,
          orderBy: {
            products: { _count: "desc" },
          },
        }),
      ])

      return NextResponse.json({
        products: topProducts,
        categories: topCategories.map(transformCategory),
      })
    }

    // Búsqueda en tiempo real cuando el usuario escribe
    const sanitized = q

    const [matchingIds, matchingCategories] = await Promise.all([
      // IDs de productos mediante tsvector y coincidencia de texto
      prisma.$queryRaw<{ id: string }[]>`
        SELECT p.id
        FROM "products" p
        LEFT JOIN "categories" c ON c.id = p."categoryId"
        LEFT JOIN "brands" b ON b.id = p."brandId"
        WHERE p."isActive" = true
          AND p.stock > 0
          AND (
            p."searchVector" @@ plainto_tsquery('spanish', ${sanitized})
            OR c.name ILIKE ${'%' + sanitized + '%'}
            OR b.name ILIKE ${'%' + sanitized + '%'}
            OR p.specs::text ILIKE ${'%' + sanitized + '%'}
            OR p.name ILIKE ${'%' + sanitized + '%'}
          )
        LIMIT 6
      `,
      // Categorías coincidentes
      prisma.category.findMany({
        where: {
          name: { contains: sanitized, mode: "insensitive" },
        },
        include: {
          _count: {
            select: { products: { where: { isActive: true, stock: { gt: 0 } } } },
          },
        },
        take: 4,
      }),
    ])

    const products = matchingIds.length > 0
      ? await prisma.product.findMany({
          where: { id: { in: matchingIds.map((m) => m.id) }, isActive: true, stock: { gt: 0 } },
          include: { category: true, brand: true },
          take: 6,
        })
      : []

    return NextResponse.json({
      products: products.map(transformProduct),
      categories: matchingCategories.map(transformCategory),
    })
  } catch (error) {
    console.error("Error fetching search suggestions:", error)
    return NextResponse.json(
      { error: "Error fetching suggestions" },
      { status: 500 }
    )
  }
}
