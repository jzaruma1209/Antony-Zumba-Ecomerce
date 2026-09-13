import { test, expect } from '@playwright/test';

test.describe('Search functionality E2E', () => {
  test('should display search results for "herramientas" and not return 0 products', async ({ page }) => {
    // Navegar directamente a la URL de búsqueda
    await page.goto('/products?search=herramientas');

    // Esperar a que el título refleje la búsqueda
    await expect(page.locator('h1')).toContainText('herramientas');

    // Verificar que NO aparezca el mensaje de "No se encontraron productos"
    const emptyState = page.locator('text=No se encontraron productos');
    await expect(emptyState).not.toBeVisible();

    // Verificar que el contador de productos no indique "0 productos encontrados"
    const counter = page.locator('text=/\\d+ productos encontrados/');
    await expect(counter).toBeVisible();
    await expect(page.locator('text=0 productos encontrados')).not.toBeVisible();

    // Verificar que exista al menos un enlace a un producto renderizado
    const productLinks = page.locator('a[href^="/products/"]');
    const count = await productLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display suggestions dropdown with categories and popular products on search focus', async ({ page }) => {
    await page.goto('/');

    // Localizar el input de búsqueda de escritorio
    const searchInput = page.locator('header input[type="search"]').first();
    await searchInput.click();

    // El dropdown de sugerencias debe abrirse
    const dropdown = page.locator('text=Productos más buscados').first();
    await expect(dropdown).toBeVisible({ timeout: 5000 });

    // Debe mostrar la sección de categorías
    const categoriesSection = page.locator('text=Categorías').first();
    await expect(categoriesSection).toBeVisible();

    // Debe mostrar sugerencias de productos
    const suggestionItem = page.locator('.group.flex.items-center.gap-3').first();
    await expect(suggestionItem).toBeVisible();
  });
});
