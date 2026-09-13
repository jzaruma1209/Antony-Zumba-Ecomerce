---
name: ecommerce-search-e2e-tester
description: Guía y flujo para verificar y mantener las pruebas E2E de búsqueda y catálogo de productos con Playwright en TumbadosZumba.
---

# Ecommerce Search E2E Tester

Esta skill proporciona las pautas y procedimientos para validar la búsqueda de productos, filtros y renderizado del catálogo usando Playwright.

## 1. Cuándo Usar Esta Skill
- Tras realizar cambios en [`src/app/api/products/route.ts`](file:///c:/Users/jzaru/OneDrive/Desktop/paul/cauralis/Antony%20Zumba%20ecomerce/Antony%20Ecomerce/src/app/api/products/route.ts) o filtros en [`src/stores/products-store.ts`](file:///c:/Users/jzaru/OneDrive/Desktop/paul/cauralis/Antony%20Zumba%20ecomerce/Antony%20Ecomerce/src/stores/products-store.ts).
- Tras modificar el esquema de base de datos o índices GIN/tsvector de búsqueda.
- Como paso previo a generar un build de producción o deployment.

## 2. Ejecución de Pruebas

Asegurarse de que el servidor de desarrollo esté activo en `http://localhost:3000`:
```powershell
npm run dev
```

### Ejecución Headless (Rápida en Consola):
```powershell
npm run test:e2e
```
o directamente con npx:
```powershell
npx playwright test
```

### Ejecución Visual (Modo Headed):
```powershell
npx playwright test --headed
```

### Ver Reporte Interactivo en Caso de Falla:
```powershell
npx playwright show-report
```

## 3. Estructura de las Pruebas E2E
Las pruebas residen en [`e2e/search.spec.ts`](file:///c:/Users/jzaru/OneDrive/Desktop/paul/cauralis/Antony%20Zumba%20ecomerce/Antony%20Ecomerce/e2e/search.spec.ts) y verifican:
1. **Búsqueda por término clave:** Navegación a `/products?search=<termino>`.
2. **Ausencia de Estado Vacío Indebido:** El selector con texto `No se encontraron productos` **no** debe estar visible si existen marcas o categorías asociadas.
3. **Contador de Resultados:** Que no reporte `0 productos encontrados`.
4. **Tarjetas de Producto:** Existencia de elementos `a[href^="/products/"]` en el DOM.

## 4. Términos Clave de Validación
Cuando se agreguen nuevos tests o se valide manualmente, verificar siempre:
- **Términos de categoría/rubro:** `"herramientas"`, `"gypsum"`, `"iluminación"`, `"cielo raso"`.
- **Marcas populares:** `"TRUPER"`, `"WADFOW"`, `"TACTIX"`, `"Gyplac"`, `"Knauf"`.
- **Medidas o specs:** `"1/2"`, `"12.7mm"`, `"1.22x2.44"`.
