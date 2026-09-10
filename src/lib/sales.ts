import { prisma } from "@/lib/prisma"

/**
 * Estados de pedido que SÍ cuentan como venta real para "más vendidos".
 * PENDING queda afuera porque el pago todavía no se confirmó (ver
 * src/app/api/webhook/stripe/route.ts, que recién pasa el pedido a
 * PROCESSING cuando Stripe confirma el cobro). CANCELLED tampoco cuenta.
 */
const COUNTED_STATUSES = ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] as const

/**
 * Unidades vendidas por producto, sumando OrderItem.quantity de pedidos ya
 * confirmados/pagados. Si se pasa `productIds`, solo agrega esos (útil para
 * no escanear toda la tabla de pedidos cuando ya se filtró por categoría,
 * marca, etc. en /api/products).
 */
export async function getSoldQuantityByProduct(
  productIds?: string[]
): Promise<Map<string, number>> {
  if (productIds && productIds.length === 0) return new Map()

  const grouped = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: {
      order: { status: { in: [...COUNTED_STATUSES] } },
      ...(productIds ? { productId: { in: productIds } } : {}),
    },
    _sum: { quantity: true },
  })

  return new Map(grouped.map((g) => [g.productId, g._sum.quantity ?? 0]))
}
