---
name: motion-bento-skeleton
description: Reglas estrictas y plantillas para replicar dos patrones de animación de este proyecto con framer-motion + Tailwind — (1) "Bento Grid Expandible": una tarjeta que se transforma en su lugar hacia un panel/modal expandido usando shared layout animation (layoutId), y (2) "Skeleton Loader": placeholders con brillo (shimmer) que hacen fade hacia el contenido real al cargar. Úsalo SIEMPRE que el usuario pida: animación bento, tarjeta que se expande, "bento expand", modal que nace de una card, skeleton loader, shimmer, placeholder de carga, o cualquier variante de estos dos patrones en este proyecto.
---

# Motion: Bento Grid Expandible + Skeleton Loader

Este documento es la referencia **obligatoria** para replicar estas dos animaciones en TumbadosZumba. No inventes variantes nuevas de estos patrones — sigue las reglas exactas de abajo. Están implementadas hoy en:

- [`src/components/home/CategoryMosaic.tsx`](../../../src/components/home/CategoryMosaic.tsx) — Bento Expand
- [`src/components/home/DynamicCalculatorSection.tsx`](../../../src/components/home/DynamicCalculatorSection.tsx) — Skeleton Loader + fade de entrada

## Stack de este proyecto

- **Librería de animación**: `framer-motion` (paquete `framer-motion`, ya en `package.json`, NO `motion/react`). Importar siempre como:
  ```tsx
  import { motion, AnimatePresence } from "framer-motion"
  ```
- **Estilos**: Tailwind CSS v4 + `style={{ }}` inline para gradientes/colores puntuales (patrón mixto ya usado en el proyecto).
- **Bordes**: este proyecto usa esquinas **cuadradas** (`borderRadius: 0` o clases sin `rounded-*`). No agregues `rounded-xl`/`rounded-2xl`/`rounded-full` a menos que el usuario pida explícitamente lo contrario.
- **Paleta de marca**:
  - Naranja acción: `#F0731E` (CTA), gradiente botón: `linear-gradient(135deg, #FF7A1E 0%, #F0531E 100%)`
  - Azul de fondo (cards/paneles): `linear-gradient(145deg, #1a3a8a 0%, #1535cc 40%, #0d1f6e 100%)`
  - Panel oscuro (modales/resultados): `linear-gradient(180deg, #0d1a35 0%, #091224 100%)`
  - WhatsApp CTA: `linear-gradient(135deg, #25D366 0%, #1aad54 100%)`

---

## ⚠️ Cuándo NO usar el Patrón 1 (regla previa, léela antes de aplicar el patrón)

El shared layout animation (`layoutId`) **solo se ve bien cuando el trigger y el destino tienen proporciones y tamaños parecidos** (ej. una card de ~300×178px que crece a un panel de ~500×400px, como en la calculadora). Motion interpola `borderRadius` + escala x/y para pasar de una caja a otra; si la diferencia de forma/tamaño es extrema, el resultado se ve roto:

- **Nunca compartas `layoutId` entre un FAB/botón circular pequeño (ej. 56px, `borderRadius: 9999`) y un modal grande casi de pantalla completa.** Se comprobó en este proyecto (popup `QuotePopup.tsx` disparado desde el botón flotante de WhatsApp) que produce un "blob" ovalado deforme y el contenido/ícono interior se ve estirado de forma grotesca durante toda la transición — quedó revertido a una animación de fade + spring normal (`initial/animate/exit` con `opacity` + `y`), que es la técnica correcta para ese caso.
- Regla práctica: si el ancho o alto del destino es **más de ~3-4 veces** el del trigger, o si el trigger es circular y el destino es rectangular grande, **no uses `layoutId` compartido**. Usa en su lugar una animación de entrada normal:
  ```tsx
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 30 }}
    transition={{ type: "spring", damping: 25, stiffness: 300 }}
  >
  ```
- El Patrón 1 (bento real) queda reservado para grids de cards tipo catálogo/dashboard donde el trigger YA es del tamaño/forma aproximado del panel expandido (como `CategoryMosaic.tsx`), no para FABs, íconos o botones pequeños que abren modales grandes.

## Patrón 1 — Bento Grid Expandible (shared layout animation)

Una tarjeta del grid se transforma en su lugar (posición + tamaño + radius) hacia un panel/modal expandido, sin que el elemento "salte" del DOM.

### Reglas estrictas

1. **Un único `layoutId` compartido** entre el trigger (card cerrada) y el contenedor expandido. Motion computa el FLIP automáticamente entre ambos.
2. **Nunca montes los dos elementos con el mismo `layoutId` a la vez.** El trigger debe desmontarse (render condicional `{!open && <motion.button layoutId="x">...}`) cuando se abre el expandido. Si ambos existen simultáneamente, Motion no puede resolver la transición.
3. **Reserva el espacio en el grid** con un wrapper de altura/ancho fija (`<div className="relative h-[150px]">`) para que el grid no colapse cuando el trigger se desmonta.
4. **Radius solo vía `style={{ borderRadius: N }}`, nunca vía clases Tailwind `rounded-*`** en los dos elementos que comparten `layoutId`. Motion corrige visualmente el border-radius durante el scale del layout animation SOLO si es un valor de `style`; con clases CSS que cambian, el radius "salta" en vez de interpolar.
5. **Transiciones separadas para gestos vs. layout**: el `transition` prop del `motion.button` gobierna el morph; los micro-gestos (`whileHover`, `whileTap`) deben llevar su propio `transition` interno para no heredar el spring lento del morph:
   ```tsx
   whileHover={{ y: -2, transition: { duration: 0.15 } }}
   whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
   transition={{ type: "spring", stiffness: 110, damping: 18 }} // gobierna el morph
   ```
6. **Spring, no tween**, para el morph — se siente más natural en layout animations. Valores por defecto de este proyecto (velocidad "normal"): `stiffness: 93-110`, `damping: 17-18`. Para ajustar velocidad manteniendo el mismo "feel" (sin más rebote), escala así:
   - Más lento: `stiffness_nuevo = stiffness / factor²`, `damping_nuevo = damping / factor`
   - Más rápido: `stiffness_nuevo = stiffness * factor²`, `damping_nuevo = damping * factor`
   - Ejemplo: para el doble de lento (factor=2), `stiffness 110→27`, `damping 18→9`.
7. **Backdrop en `AnimatePresence` separado**, con fade simple por `tween`:
   ```tsx
   <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.36}} />
   ```
8. **El botón de cerrar (X) vive DENTRO del contenedor con `layoutId`**, arriba a la derecha, con fondo translúcido (`rgba(255,255,255,0.1)`) — nunca flotando afuera del panel.
9. Clic en el backdrop cierra; clic dentro del panel usa `onClick={(e) => e.stopPropagation()}` para no cerrarlo.

### Plantilla base

```tsx
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

export function BentoExpandCard() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Wrapper que reserva el espacio en el grid */}
      <div className="relative h-[150px] sm:h-[178px]">
        {!open && (
          <motion.button
            layoutId="bento-card"
            type="button"
            onClick={() => setOpen(true)}
            className="absolute inset-0 overflow-hidden text-left"
            style={{
              background: "linear-gradient(160deg, #2E6BFF 0%, #1E4FD6 55%, #0a1a3a 100%)",
              borderRadius: 0, // SIEMPRE style, nunca className rounded-*
            }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
            transition={{ type: "spring", stiffness: 110, damping: 18 }}
          >
            {/* Contenido de la card cerrada */}
          </motion.button>
        )}
      </div>

      {/* Overlay expandido */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.36 }}
            style={{ background: "rgba(2,4,10,0.82)", backdropFilter: "blur(5px)" }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              layoutId="bento-card"
              className="relative w-full max-w-sm overflow-hidden"
              style={{ borderRadius: 0 }} // mismo valor que el trigger (o el destino final)
              transition={{ type: "spring", stiffness: 93, damping: 17 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 z-20 flex items-center justify-center w-8 h-8 text-white/70 hover:text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.1)" }}
                aria-label="Cerrar"
              >
                <X size={16} strokeWidth={1.75} />
              </button>
              {/* Contenido expandido */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

---

## Patrón 2 — Skeleton Loader (shimmer → fade a contenido real)

Placeholders con forma idéntica al contenido final, con un brillo diagonal en loop, que al terminar la carga hacen fade hacia el contenido real.

### Reglas estrictas

1. **El skeleton debe imitar EXACTAMENTE la forma/dimensiones del contenido real** (mismos paddings, alturas de inputs, tamaños de íconos) para que no haya salto de layout al cambiar.
2. **Primitivo `Skeleton` reutilizable**: un bloque `bg-white/10` (o el tono translúcido acorde al fondo) con un `motion.div` absoluto que barre un gradiente de izquierda a derecha en loop infinito:
   ```tsx
   function Skeleton({ className = "" }: { className?: string }) {
     return (
       <div className={`relative overflow-hidden bg-white/10 ${className}`}>
         <motion.div
           className="absolute inset-0"
           style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)" }}
           animate={{ x: ["-100%", "100%"] }}
           transition={{ duration: 1.3, repeat: Infinity, ease: "linear" }}
         />
       </div>
     )
   }
   ```
3. **Sin `rounded-*`** en los bloques skeleton si el diseño del componente real es cuadrado (regla global del proyecto).
4. **Transición entre skeleton y contenido real con `AnimatePresence mode="wait"`**, cada rama con su propia `key`:
   ```tsx
   <AnimatePresence mode="wait">
     {loading ? (
       <motion.div key="skeleton" exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
         <ComponentSkeleton />
       </motion.div>
     ) : (
       <motion.div
         key="content"
         initial={{ opacity: 0, scale: 0.98 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.3, ease: "easeOut" }}
       >
         {/* Contenido real */}
       </motion.div>
     )}
   </AnimatePresence>
   ```
5. **No uses gris genérico** (`bg-gray-300` estilo shadcn default) si el skeleton vive sobre un fondo de color de marca (ej. el gradiente azul) — usa opacidad blanca translúcida (`bg-white/10`) para que se perciba como "hueco" sobre ese fondo, no como una caja gris ajena.
6. El componente `Skeleton` y el `*Skeleton` específico (ej. `CalculatorSkeleton`) se declaran **fuera** del componente principal, como funciones auxiliares en el mismo archivo.

### Plantilla base

```tsx
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-white/10 ${className}`}>
      <motion.div
        className="absolute inset-0"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)" }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.3, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}

function MyComponentSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-5">
      <div className="flex items-center gap-3">
        <Skeleton className="w-9 h-9 flex-shrink-0" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-2.5 w-28" />
        </div>
      </div>
      <Skeleton className="h-[42px] w-full" />
      <Skeleton className="h-[46px] w-full" />
    </div>
  )
}

// Uso dentro del componente con estado `loading`:
<AnimatePresence mode="wait">
  {loading ? (
    <motion.div key="skeleton" exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <MyComponentSkeleton />
    </motion.div>
  ) : (
    <motion.div key="content" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      {/* contenido real */}
    </motion.div>
  )}
</AnimatePresence>
```

---

## Checklist antes de entregar cualquiera de los dos patrones

- [ ] `framer-motion` importado como `{ motion, AnimatePresence }`, nunca `motion/react`
- [ ] Sin `rounded-*` en Tailwind — solo `style={{ borderRadius }}` si aplica, y valor `0` salvo que se pida otra cosa
- [ ] (Bento) el trigger se desmonta condicionalmente; nunca coexiste con el expandido bajo el mismo `layoutId`
- [ ] (Bento) transición de hover/tap separada de la transición de morph
- [ ] (Skeleton) el skeleton reproduce las dimensiones exactas del contenido real
- [ ] (Skeleton) `AnimatePresence mode="wait"` con `key` distinto por rama
- [ ] Colores tomados de la paleta de marca de este proyecto (sección "Stack de este proyecto" arriba), no colores genéricos inventados
- [ ] Verificado en el navegador (preview) antes de dar el trabajo por terminado
