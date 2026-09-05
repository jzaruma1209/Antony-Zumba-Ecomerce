"use client"

import { useState, useEffect } from "react"
import { Search, ShoppingCart, RefreshCcw, Eye, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdminStore } from "@/stores/admin-store"

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Pendiente", className: "bg-yellow-500 text-white" },
  processing: { label: "Procesando", className: "bg-blue-500 text-white" },
  shipped: { label: "Enviado", className: "bg-purple-500 text-white" },
  delivered: { label: "Entregado", className: "bg-green-600 text-white" },
  cancelled: { label: "Cancelado", className: "bg-red-500 text-white" },
}

export default function AdminOrdersPage() {
  const { orders, ordersTotal, loading, fetchOrders, updateOrderStatus } = useAdminStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchOrders({ status: statusFilter === "all" ? undefined : statusFilter })
  }, [statusFilter, fetchOrders])

  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase()
    return (
      order.orderNumber.toLowerCase().includes(q) ||
      order.customer.name.toLowerCase().includes(q) ||
      order.customer.email.toLowerCase().includes(q)
    )
  })

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus)
    } catch {
      // error handled in store
    }
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const pendingCount = orders.filter((o) => o.status === "pending").length
  const deliveredCount = orders.filter((o) => o.status === "delivered").length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Órdenes</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {ordersTotal} órdenes en total
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchOrders({ status: statusFilter === "all" ? undefined : statusFilter })}
          disabled={loading}
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} strokeWidth={1.75} />
          Actualizar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Ingresos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-mono">
              $ {totalRevenue.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-mono">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Entregadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-mono">{deliveredCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
          <Input
            placeholder="Buscar por número, cliente o email..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
            <SelectItem value="processing">Procesando</SelectItem>
            <SelectItem value="shipped">Enviado</SelectItem>
            <SelectItem value="delivered">Entregado</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    Cargando órdenes...
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-40" strokeWidth={1.75} />
                    No se encontraron órdenes
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => {
                  const statusInfo = statusConfig[order.status] ?? {
                    label: order.status,
                    className: "bg-gray-400 text-white",
                  }
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono font-medium text-sm">
                        #{order.orderNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{order.customer.name}</p>
                          <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${statusInfo.className}`}>
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{order.itemCount}</TableCell>
                      <TableCell className="text-right font-mono font-semibold text-sm">
                        $ {order.total.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("es-EC", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <ChevronDown className="h-4 w-4" strokeWidth={1.75} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem disabled>
                              <Eye className="h-4 w-4 mr-2" strokeWidth={1.75} />
                              Ver detalle
                            </DropdownMenuItem>
                            {Object.entries(statusConfig)
                              .filter(([key]) => key !== order.status)
                              .map(([key, val]) => (
                                <DropdownMenuItem
                                  key={key}
                                  onClick={() => handleStatusChange(order.id, key)}
                                >
                                  Marcar como {val.label}
                                </DropdownMenuItem>
                              ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
