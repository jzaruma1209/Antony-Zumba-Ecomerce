"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Proforma, ProformaStatus } from "@/types"

const statusLabels: Record<ProformaStatus, string> = {
  PENDIENTE: "Pendiente",
  COTIZADA: "Cotizada",
  ENVIADA: "Enviada",
}

export default function AdminProformaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [proforma, setProforma] = useState<Proforma | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [contactName, setContactName] = useState("")
  const [contactPhone, setContactPhone] = useState("")

  useEffect(() => {
    loadProforma()
  }, [id])

  async function loadProforma() {
    try {
      const res = await fetch(`/api/admin/proformas/${id}`)
      if (!res.ok) throw new Error("Not found")
      const data: Proforma = await res.json()
      setProforma(data)
      setContactName(data.contactName || "")
      setContactPhone(data.contactPhone || "")
    } catch (err) {
      alert("Error al cargar la proforma")
      router.back()
    } finally {
      setLoading(false)
    }
  }

  async function patchProforma(patch: Record<string, string>) {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/proformas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      })
      if (!res.ok) throw new Error("Failed")
      await loadProforma()
    } catch (err) {
      alert("Error al actualizar la proforma")
    } finally {
      setSaving(false)
    }
  }

  function handleSendWhatsApp() {
    if (!proforma || !contactPhone) return

    const itemsList = proforma.items
      .map((item) => `• ${item.name}: ${item.quantity} ${item.unit}${item.unitPrice ? ` — $${item.total?.toFixed(2)}` : ""}`)
      .join("\n")

    const msg = encodeURIComponent(
      `🏗️ *Proforma - TumbadosZumba*\n\n` +
      `👤 *Cliente:* ${contactName || proforma.user?.name || ""}\n` +
      `📐 *Sistema:* ${proforma.calculator.name}\n` +
      `📏 *Área:* ${proforma.area} m²\n\n` +
      `📦 *Materiales:*\n${itemsList}\n\n` +
      `💰 *Total estimado: $${(proforma.total ?? 0).toFixed(2)}*\n\n` +
      `Quedamos atentos. ¡Gracias! 🙏`
    )

    const phoneDigits = contactPhone.replace(/\D/g, "")
    window.open(`https://wa.me/${phoneDigits}?text=${msg}`, "_blank")
    patchProforma({ status: "ENVIADA" })
  }

  if (loading || !proforma) {
    return <div className="p-6 text-center text-muted-foreground">Cargando...</div>
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Link
        href="/admin/proformas"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Volver a Proformas
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{proforma.calculator.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {proforma.user?.name} · {proforma.user?.email} · {proforma.area} m²
          </p>
        </div>
        <Select
          value={proforma.status}
          onValueChange={(value) => patchProforma({ status: value })}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(statusLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Materiales</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead className="text-right">P. Unitario</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proforma.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-sm">{item.name}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {item.quantity} {item.unit}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {item.unitPrice != null ? `$ ${item.unitPrice.toFixed(2)}` : "—"}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {item.total != null ? `$ ${item.total.toFixed(2)}` : "—"}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="text-right font-semibold text-sm">
                  Total
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-sm">
                  $ {(proforma.total ?? 0).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contacto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nombre</label>
              <Input
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Nombre del cliente"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Teléfono{" "}
                {!proforma.contactPhone && (
                  <Badge variant="outline" className="ml-1 text-muted-foreground align-middle">
                    Número no ingresado
                  </Badge>
                )}
              </label>
              <Input
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Ej: 593999999999"
                className="mt-1"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              disabled={saving}
              onClick={() => patchProforma({ contactName, contactPhone })}
            >
              Guardar contacto
            </Button>
            <Button
              className="bg-[#25D366] hover:bg-[#1aad54]"
              disabled={!contactPhone}
              onClick={handleSendWhatsApp}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Enviar proforma
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
