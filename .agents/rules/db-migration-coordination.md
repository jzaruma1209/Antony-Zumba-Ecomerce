---
trigger: always_on
---

# Coordinación de Base de Datos y Prevención de Drift

1. **Suspensión de Consultas ante Drift:** Cuando se detecte drift en la base de datos o se estén aplicando migraciones manuales (scripts raw SQL, índices GIN, triggers nativos de PostgreSQL), ningún agente debe realizar consultas ni transacciones hasta que el drift esté 100% resuelto y el esquema confirmado con Prisma (`npx prisma migrate status`).
2. **Validaciones Offline:** Durante periodos de estabilización de la base de datos, las validaciones de código deben limitarse a análisis estático (`npx tsc --noEmit`) o inspección de archivos sin conexión activa a la DB.
3. **Mantenimiento del Índice Full-Text:** Cualquier modificación en las columnas de `Product` (`name`, `description`, `specs`), `Category` o `Brand` que deba impactar el motor de búsqueda requiere actualizar la función trigger del `tsvector` (`products_search_vector_trigger`) y ejecutar `UPDATE "products" SET "updatedAt" = now();`.
4. **Verificación de Regresión Obligatoria:** Después de aplicar cualquier cambio de esquema o migración que afecte productos o catálogo, es obligatorio ejecutar la suite de pruebas E2E con `npm run test:e2e` para garantizar que la búsqueda y los listados continúen respondiendo correctamente.
