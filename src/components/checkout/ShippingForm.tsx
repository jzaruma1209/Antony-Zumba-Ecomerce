"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ShippingForm() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Informacion de Envio</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre</Label>
          <Input id="firstName" placeholder="Juan" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido</Label>
          <Input id="lastName" placeholder="Perez" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo Electronico</Label>
        <Input id="email" type="email" placeholder="juan@ejemplo.com" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input id="phone" type="tel" placeholder="+593 99 988 8777" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Input id="address" placeholder="Av. Amazonas y Naciones Unidas" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="city">Ciudad</Label>
          <Input id="city" placeholder="Quito" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">Provincia</Label>
          <Select>
            <SelectTrigger id="state">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pichincha">Pichincha</SelectItem>
              <SelectItem value="guayas">Guayas</SelectItem>
              <SelectItem value="azuay">Azuay</SelectItem>
              <SelectItem value="manabi">Manabí</SelectItem>
              <SelectItem value="el-oro">El Oro</SelectItem>
              <SelectItem value="loja">Loja</SelectItem>
              <SelectItem value="tungurahua">Tungurahua</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="zip">Codigo Postal</Label>
          <Input id="zip" placeholder="15001" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notas adicionales (opcional)</Label>
        <Input
          id="notes"
          placeholder="Instrucciones de entrega, referencias, etc."
        />
      </div>
    </div>
  )
}
