"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calculator } from '@/types'
import { Plus, Edit2, Trash2 } from 'lucide-react'

export default function CalculatorsPage() {
  const [calculators, setCalculators] = useState<Calculator[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCalculators()
  }, [])

  async function loadCalculators() {
    try {
      setLoading(true)
      const res = await fetch('/api/calculators')
      if (!res.ok) throw new Error('Failed to load calculators')
      const data = await res.json()
      setCalculators(data)
      setError(null)
    } catch (err) {
      setError('Error al cargar calculadoras')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function deleteCalculator(id: string) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta calculadora?')) return

    try {
      const res = await fetch(`/api/calculators/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      await loadCalculators()
    } catch (err) {
      alert('Error al eliminar')
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calculadoras de Materiales</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona los sistemas de cálculo de materiales
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/calculators/new">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Calculadora
          </Link>
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando calculadoras...</p>
        </div>
      ) : calculators.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No hay calculadoras configuradas</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {calculators.map((calc) => (
            <div
              key={calc.id}
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{calc.name}</h3>
                  <p className="text-sm text-muted-foreground">{calc.description}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span>Área: {calc.area} m²</span>
                    <span>{calc.materials.length} materiales</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/calculators/${calc.id}/edit`}>
                      <Edit2 className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteCalculator(calc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {calc.materials.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">MATERIALES:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    {calc.materials.map((mat) => (
                      <div key={mat.id} className="p-2 bg-muted rounded">
                        <div className="font-medium">{mat.name}</div>
                        <div className="text-muted-foreground">
                          {mat.yield} {mat.unit}/m²
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
