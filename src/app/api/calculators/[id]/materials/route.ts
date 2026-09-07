import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = Promise<{ id: string }>

export async function POST(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { name, unit, yield: yieldValue } = body

    const maxPosition = await prisma.calculatorMaterial.findFirst({
      where: { calculatorId: id },
      orderBy: { position: 'desc' },
      select: { position: true }
    })

    const newPosition = (maxPosition?.position ?? -1) + 1

    const material = await prisma.calculatorMaterial.create({
      data: {
        name,
        unit,
        yield: parseFloat(yieldValue),
        position: newPosition,
        calculatorId: id
      }
    })

    return NextResponse.json(material, { status: 201 })
  } catch (error) {
    console.error('Error creating material:', error)
    return NextResponse.json(
      { error: 'Failed to create material' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    await params
    const body = await req.json()
    const { materialId, name, unit, yield: yieldValue, position } = body

    const material = await prisma.calculatorMaterial.update({
      where: { id: materialId },
      data: {
        name,
        unit,
        yield: parseFloat(yieldValue),
        position: parseInt(position)
      }
    })

    return NextResponse.json(material)
  } catch (error) {
    console.error('Error updating material:', error)
    return NextResponse.json(
      { error: 'Failed to update material' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    await params
    const { searchParams } = new URL(req.url)
    const materialId = searchParams.get('materialId')

    if (!materialId) {
      return NextResponse.json(
        { error: 'Material ID is required' },
        { status: 400 }
      )
    }

    await prisma.calculatorMaterial.delete({
      where: { id: materialId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting material:', error)
    return NextResponse.json(
      { error: 'Failed to delete material' },
      { status: 500 }
    )
  }
}
