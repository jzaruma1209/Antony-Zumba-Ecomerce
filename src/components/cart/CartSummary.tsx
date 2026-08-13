"use client"

import { Truck, MessageCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { CartItem } from "@/types"
import { StripeCheckoutButton } from "./StripeCheckoutButton"
import { useCartStore } from "@/stores/cart-store"

interface CartSummaryProps {
  items: CartItem[]
}

export function CartSummary({ items }: CartSummaryProps) {
  const clearCart = useCartStore((state) => state.clearCart)
  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  )
  const shipping = subtotal >= 200 ? 0 : 15
  const total = subtotal + shipping

  const handleWhatsAppOrder = () => {
    let msg = `👋 Hola, me gustaría realizar el siguiente pedido:\n\n🛒 *Resumen del Pedido:*\n`;
    
    items.forEach(item => {
      msg += `- ${item.quantity}x ${item.product.name} ($${(item.product.price * item.quantity).toFixed(2)})\n`;
    });

    msg += `\n💵 *Subtotal:* $${subtotal.toFixed(2)}`;
    msg += `\n🚚 *Envío:* ${shipping === 0 ? "Gratis" : "$" + shipping.toFixed(2)}`;
    msg += `\n💰 *Total:* $${total.toFixed(2)}`;
    msg += `\n\nPor favor, indíquenme los pasos a seguir para el pago y entrega.`;

    const WHATSAPP_NUM = "593990099265";
    const uri = `https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(msg)}`;
    window.open(uri, "_blank");
    clearCart();
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-lg font-semibold">Resumen del Pedido</h2>

      <div className="mt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Envio</span>
          <span>{shipping === 0 ? "Gratis" : `$${shipping.toFixed(2)}`}</span>
        </div>

        {shipping > 0 && (
          <div className="flex items-center gap-2 rounded-md bg-muted p-3 text-xs">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <span>
              Agrega ${(200 - subtotal).toFixed(2)} mas para envio gratis
            </span>
          </div>
        )}

        <Separator />

        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span className="text-lg text-primary">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Button 
          className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold" 
          onClick={handleWhatsAppOrder}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Hacer compra por WhatsApp
        </Button>
        
        {/* Stripe oculto temporalmente por petición del cliente 
        <StripeCheckoutButton />
        */}
      </div>

      {/* 
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Pago seguro con Stripe. Impuestos incluidos.
      </p>
      */}
    </div>
  )
}
