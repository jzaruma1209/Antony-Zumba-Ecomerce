import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { transformCategory } from "@/lib/transformers"

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(categories.map(transformCategory))
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Error fetching categories" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name?.trim() || !body.slug?.trim()) {
      return NextResponse.json(
        { error: "El nombre y el slug son obligatorios" },
        { status: 400 }
      )
    }

    const cleanSlug = body.slug.trim().toLowerCase()

    // Verificar si ya existe una categoría con este slug
    const existing = await prisma.category.findUnique({
      where: { slug: cleanSlug },
    })

    if (existing) {
      return NextResponse.json(
        { error: `Ya existe una categoría con el slug "${cleanSlug}". Por favor elige otro slug.` },
        { status: 409 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name: body.name.trim(),
        slug: cleanSlug,
        icon: body.icon?.trim() || "Package",
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    })

    return NextResponse.json(transformCategory(category), { status: 201 })
  } catch (error: any) {
    console.error("Error creating category:", error)
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe una categoría con este slug." },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: "Error al crear la categoría" },
      { status: 500 }
    )
  }
}

