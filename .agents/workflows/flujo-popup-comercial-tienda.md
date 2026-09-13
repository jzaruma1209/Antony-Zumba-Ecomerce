# Workflow: Integración de Popups Comerciales y Modales Lead en Tienda

Este flujo estandariza la creación, estilización y montaje de modales comerciales, popups promocionales y captadores de cotización en TumbadosZumba.

---

### Paso 1: Extracción de Tokens desde Stitch (MCP)
1. Conectar al servidor `StitchMCP` y listar los proyectos y pantallas disponibles (`list_projects`, `list_screens`).
2. Extraer los tokens de color, layout (desktop/móvil) y assets fotográficos exactos sin alterar la paleta oficial del Design System.

---

### Paso 2: Construcción del Componente Modal
1. Ubicar el componente en `src/components/[dominio]/` (ej: `src/components/quote/QuotePopup.tsx`).
2. Añadir `"use client"` y utilizar `<AnimatePresence>` junto a `motion.div`.
3. Aplicar tipado estricto `Variants` a las animaciones para evitar errores TS2322 en React 19.
4. Diseñar el botón de cierre exterior (`absolute -top-11 right-0 sm:-right-12 sm:top-0`) asegurando un wrapper sin `overflow-hidden`.

---

### Paso 3: Inyección Global en Layout
1. En vez de instanciar el modal manualmente en múltiples páginas, integrarlo en un componente persistente del layout (como `src/components/layout/WhatsAppFloat.tsx` o `ShopLayout`).
2. Vincular el activador manual (botón flotante) al estado `isQuoteOpen`.

---

### Paso 4: Control de Audiencia por Sesión (`useSession`)
1. Importar `useSession` de `next-auth/react`.
2. Si el usuario ya está autenticado (`status === "authenticated"`), no disparar automáticamente el popup.
3. Si el usuario no está logueado, disparar tras un delay suave (ej. 2000ms) para captar leads sin colisionar con la hidratación inicial del navegador.

---

### Paso 5: Verificación de Calidad
1. Ejecutar análisis estático:
   ```bash
   npx tsc --noEmit
   ```
2. Validar el build de producción:
   ```bash
   npm run build
   ```
