import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const calculators = await prisma.calculator.findMany({
      include: {
        materials: {
          orderBy: { position: 'asc' }
        }
      },
      where: { isActive: true }
    })

    return NextResponse.json(calculators)
  } catch (error) {
    console.error('Error fetching calculators:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calculators' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, description, area, materials } = body

    const slug = name.toLowerCase().replace(/\s+/g, '-')

    const calculator = await prisma.calculator.create({
      data: {
        name,
        slug,
        description,
        area: parseFloat(area),
        materials: {
          create: materials.map((material: any, index: number) => ({
            name: material.name,
            unit: material.unit,
            yield: parseFloat(material.yield),
            position: index
          }))
        }
      },
      include: {
        materials: {
          orderBy: { position: 'asc' }
        }
      }
    })

    return NextResponse.json(calculator, { status: 201 })
  } catch (error) {
    console.error('Error creating calculator:', error)
    return NextResponse.json(
      { error: 'Failed to create calculator' },
      { status: 500 }
    )
  }
}
