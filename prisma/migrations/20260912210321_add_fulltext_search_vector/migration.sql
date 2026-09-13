-- 1. Agregar la columna de vector (si no se agregó en la migración de Prisma)
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "searchVector" tsvector;

-- 2. Actualizar los registros existentes
UPDATE "products"
SET "searchVector" = to_tsvector('spanish', coalesce("name", '') || ' ' || coalesce("description", ''));

-- 3. Crear el índice GIN
CREATE INDEX IF NOT EXISTS "products_searchVector_idx" ON "products" USING GIN ("searchVector");

-- 4. Crear la función del trigger
CREATE OR REPLACE FUNCTION product_search_vector_trigger() RETURNS trigger AS $$
BEGIN
  NEW."searchVector" := to_tsvector('spanish', coalesce(NEW."name", '') || ' ' || coalesce(NEW."description", ''));
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- 5. Vincular el trigger a la tabla Product
DROP TRIGGER IF EXISTS tsvectorupdate ON "products";
CREATE TRIGGER tsvectorupdate
BEFORE INSERT OR UPDATE ON "products"
FOR EACH ROW EXECUTE FUNCTION product_search_vector_trigger();
