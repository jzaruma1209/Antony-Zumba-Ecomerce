# Flujo de Trabajo: Mantenimiento del Motor de Búsqueda Full-Text

Este workflow documenta los pasos para dar mantenimiento o actualizar el motor de búsqueda de productos con PostgreSQL (`tsvector` + índice GIN) en TumbadosZumba.

---

## Cuándo Aplicar este Workflow

- Cuando se añadan nuevos campos al modelo `Product` que deban ser buscables (ej. etiquetas/tags, código de barras, campos de catálogo).
- Cuando se actualice la lógica de pesos (`setweight`) para priorizar títulos sobre descripciones o marcas.
- Cuando se detecte inconsistencias de resultados en búsquedas complejas o plurales.

---

## Pasos de Ejecución

### 1. Actualizar la Función Trigger en PostgreSQL
Si cambian las columnas a indexar, actualizar la función `products_search_vector_trigger`:

```sql
CREATE OR REPLACE FUNCTION products_search_vector_trigger() RETURNS trigger AS $$
DECLARE
    cat_name text := '';
    brand_name text := '';
    specs_text text := '';
BEGIN
    SELECT name INTO cat_name FROM "categories" WHERE id = NEW."categoryId";
    SELECT name INTO brand_name FROM "brands" WHERE id = NEW."brandId";
    
    IF NEW.specs IS NOT NULL THEN
        SELECT string_agg(value, ' ') INTO specs_text
        FROM jsonb_each_text(NEW.specs::jsonb);
    END IF;

    NEW."searchVector" := 
        setweight(to_tsvector('spanish', coalesce(NEW.name, '')), 'A') ||
        setweight(to_tsvector('spanish', coalesce(cat_name, '')), 'B') ||
        setweight(to_tsvector('spanish', coalesce(brand_name, '')), 'B') ||
        setweight(to_tsvector('spanish', coalesce(NEW.description, '')), 'C') ||
        setweight(to_tsvector('spanish', coalesce(specs_text, '')), 'C');

    RETURN NEW;
END
$$ LANGUAGE plpgsql;
```

### 2. Forzar Regeneración de Vectores Existentes
Para que todos los productos ya guardados recalculen su `searchVector`:
```sql
UPDATE "products" SET "updatedAt" = now();
```

### 3. Verificar el Índice GIN
Asegurar que el índice esté presente y activo:
```sql
CREATE INDEX IF NOT EXISTS products_search_vector_gin_idx ON "products" USING GIN ("searchVector");
```

### 4. Ejecución del Test de Regresión E2E
Correr la suite automatizada para confirmar que el frontend y el endpoint devuelven resultados:
```powershell
npm run test:e2e
```
