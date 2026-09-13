# Estándar de Framer Motion en React 19 y TypeScript

1. **Tipado Obligatorio de Variantes (`Variants`):**
   Al definir objetos de variantes para animaciones en componentes con TypeScript, siempre importar explícitamente `type { Variants } from "framer-motion"`.
   ```ts
   import type { Variants } from "framer-motion"

   const containerVariants: Variants = {
     hidden: { opacity: 0 },
     visible: {
       opacity: 1,
       transition: {
         staggerChildren: 0.1,
         delayChildren: 0.15,
       },
     },
   }
   ```

2. **Prevención de Error TS2322 en Curvas de Transición (`Easing`):**
   Nunca declarar `ease: "easeOut"` o similares sin tipado o sin `as const`. En Framer Motion v13, TypeScript infiere un string genérico que es incompatible con el tipo unión `Easing`. Tipar el objeto como `Variants` resuelve este error de raíz.

3. **Cierre Controlado con `<AnimatePresence>`:**
   Cualquier modal, popup o banner condicional debe estar envuelto en `<AnimatePresence>` con un `key` único en el nodo animado raíz para permitir animaciones de salida (`exit={{ opacity: 0 }}`) correctas.
