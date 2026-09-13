---
name: playwright-e2e-setup
description: Guía paso a paso y mejores prácticas para instalar, configurar y ejecutar pruebas E2E con Playwright en aplicaciones Next.js.
---

# Playwright E2E Setup & Testing

Esta skill define el procedimiento estándar para integrar, configurar y ejecutar pruebas de extremo a extremo (E2E) con Playwright en proyectos web (especialmente Next.js con App Router).

---

## 1. Instalación de Dependencias

Instalar Playwright **estrictamente** en `devDependencies` para no inflar la imagen de producción ni las dependencias del runtime:

```powershell
npm install --save-dev @playwright/test
```

Instalar los navegadores necesarios (por defecto Chromium suele ser suficiente y más rápido):

```powershell
npx playwright install chromium
```

*(Opcional: Si se requieren todos los navegadores —Firefox, WebKit— ejecutar `npx playwright install`)*.

---

## 2. Configuración (`playwright.config.ts`)

Crear el archivo de configuración en la raíz del proyecto [`playwright.config.ts`](file:///c:/Users/jzaru/OneDrive/Desktop/paul/cauralis/Antony%20Zumba%20ecomerce/Antony%20Ecomerce/playwright.config.ts):

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

---

## 3. Scripts en `package.json`

Agregar el script de ejecución en la sección `"scripts"` de [`package.json`](file:///c:/Users/jzaru/OneDrive/Desktop/paul/cauralis/Antony%20Zumba%20ecomerce/Antony%20Ecomerce/package.json):

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed"
  }
}
```

---

## 4. Estructura de Tests Aislados (`/e2e`)

Crear los archivos de prueba dentro del directorio `/e2e` con la extensión `.spec.ts`:

### Ejemplo de Prueba de Búsqueda y Catálogo:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Búsqueda de Productos', () => {
  test('debe mostrar resultados y no estado vacío para término válido', async ({ page }) => {
    // 1. Navegar a la URL objetivo
    await page.goto('/products?search=herramientas');

    // 2. Verificar encabezados o parámetros visuales
    await expect(page.locator('h1')).toContainText('herramientas');

    // 3. Comprobar que no se muestre el estado vacío
    const emptyState = page.locator('text=No se encontraron productos');
    await expect(emptyState).not.toBeVisible();

    // 4. Validar que el contador no sea 0
    await expect(page.locator('text=0 productos encontrados')).not.toBeVisible();

    // 5. Verificar elementos interactivos o tarjetas renderizadas
    const cards = page.locator('a[href^="/products/"]');
    expect(await cards.count()).toBeGreaterThan(0);
  });
});
```

---

## 5. Ejecución de Pruebas

Asegurar que el servidor local esté corriendo en segundo plano o en otra terminal:
```powershell
npm run dev
```

### Comandos de Ejecución:

1. **Modo Headless (Rápido, estándar para CI/Consola):**
   ```powershell
   npm run test:e2e
   ```
2. **Modo Visual (Ver el navegador interactuando en tiempo real):**
   ```powershell
   npx playwright test --headed
   ```
3. **Modo UI Interactivo (Time-travel debugging y selector inspector):**
   ```powershell
   npx playwright test --ui
   ```
4. **Ver Reporte HTML Detallado:**
   ```powershell
   npx playwright show-report
   ```

---

## 6. Buenas Prácticas
- **Aislamiento:** No mezclar tests unitarios (Jest/Vitest) con tests E2E. Mantener `/e2e` limpio.
- **Selectores Robustos:** Preferir roles accesibles (`page.getByRole`), etiquetas semánticas (`page.getByLabel`, `page.getByPlaceholder`) o atributos estables en lugar de clases CSS volátiles de Tailwind.
- **Evitar Timeouts Hardcodeados:** Usar las aserciones asíncronas de Playwright (`await expect(...)`) que incluyen auto-reintento (`auto-retrying`) en lugar de `setTimeout` o esperas manuales.
