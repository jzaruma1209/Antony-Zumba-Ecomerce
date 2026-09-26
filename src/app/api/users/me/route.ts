import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const userId = session.user.id

    await prisma.$transaction([
      // Se conservan las direcciones ligadas a pedidos existentes (historial contable);
      // el resto de direcciones del usuario sí se eliminan.
      prisma.address.deleteMany({
        where: { userId, orders: { none: {} } },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          status: "INACTIVE",
          deletedAt: new Date(),
          name: "Usuario eliminado",
          email: `deleted-${userId}@tumbadoszumba.local`,
          phone: null,
          avatar: null,
          password: null,
        },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting account:", error)
    return NextResponse.json(
      { error: "Error al eliminar la cuenta" },
      { status: 500 }
    )
  }
}
