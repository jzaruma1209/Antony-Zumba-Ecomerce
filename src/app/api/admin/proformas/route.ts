import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const userId = searchParams.get("userId")
    const q = searchParams.get("q")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    const where: Record<string, unknown> = {}

    if (status && status !== "all") {
      where.status = status.toUpperCase()
    }
    if (userId) {
      where.userId = userId
    }
    if (q) {
      where.OR = [
        { user: { name: { contains: q, mode: "insensitive" } } },
        { user: { email: { contains: q, mode: "insensitive" } } },
        { calculator: { name: { contains: q, mode: "insensitive" } } },
      ]
    }

    const [proformas, total, pendientes, cotizadas] = await Promise.all([
      prisma.proforma.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          calculator: { select: { id: true, name: true } },
          items: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.proforma.count({ where }),
      prisma.proforma.count({ where: { status: "PENDIENTE" } }),
      prisma.proforma.count({ where: { status: "COTIZADA" } }),
    ])

    const transformed = proformas.map((p) => ({
      id: p.id,
      status: p.status,
      area: Number(p.area),
      contactName: p.contactName,
      contactPhone: p.contactPhone,
      createdAt: p.createdAt.toISOString(),
      user: p.user,
      calculator: p.calculator,
      itemCount: p.items.length,
      total: p.items.reduce(
        (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice ?? 0),
        0
      ),
    }))

    return NextResponse.json({
      proformas: transformed,
      total,
      pendientes,
      cotizadas,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Error fetching admin proformas:", error)
    return NextResponse.json(
      { error: "Error al obtener las proformas" },
      { status: 500 }
    )
  }
}
