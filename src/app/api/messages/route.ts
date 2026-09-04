import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST: Enviar un nuevo mensaje desde el formulario de contacto (público)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Todos los campos obligatorios deben ser completados" },
        { status: 400 }
      )
    }

    const newMessage = await prisma.message.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
      },
    })

    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error("Error al guardar mensaje:", error)
    return NextResponse.json(
      { error: "Error al enviar el mensaje" },
      { status: 500 }
    )
  }
}

// GET: Listar mensajes para el panel de administración
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get("unread") === "true"

    const where = unreadOnly ? { isRead: false } : {}

    const messages = await prisma.message.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    const unreadCount = await prisma.message.count({
      where: { isRead: false },
    })

    return NextResponse.json({
      messages,
      unreadCount,
    })
  } catch (error) {
    console.error("Error al obtener mensajes:", error)
    return NextResponse.json(
      { error: "Error al obtener mensajes" },
      { status: 500 }
    )
  }
}
