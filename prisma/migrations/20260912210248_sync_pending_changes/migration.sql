-- This migration is a baseline that captures existing changes already applied to the database.
-- All tables and columns below already exist in the database, so we use IF NOT EXISTS clauses.

-- Note: CreateTable statements for tables that already exist
CREATE TABLE IF NOT EXISTS "calculators" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "area" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "calculators_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "calculator_materials" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "yield" DECIMAL(10,4) NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "calculatorId" TEXT NOT NULL,
    CONSTRAINT "calculator_materials_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "media_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "size" INTEGER,
    "folder" TEXT NOT NULL DEFAULT 'general',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "media_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "messages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- Add columns if they don't exist
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "freeShipping" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "returnPolicy" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "returnDays" INTEGER;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "warranty" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "warrantyPeriod" TEXT;

-- Create indices if they don't exist
CREATE UNIQUE INDEX IF NOT EXISTS "calculators_name_key" ON "calculators"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "calculators_slug_key" ON "calculators"("slug");
CREATE INDEX IF NOT EXISTS "calculator_materials_calculatorId_idx" ON "calculator_materials"("calculatorId");
CREATE UNIQUE INDEX IF NOT EXISTS "media_items_publicId_key" ON "media_items"("publicId");
CREATE INDEX IF NOT EXISTS "media_items_folder_idx" ON "media_items"("folder");
CREATE INDEX IF NOT EXISTS "products_isActive_comparePrice_idx" ON "products"("isActive", "comparePrice");
CREATE INDEX IF NOT EXISTS "products_isActive_createdAt_idx" ON "products"("isActive", "createdAt");
CREATE INDEX IF NOT EXISTS "products_isActive_isFeatured_idx" ON "products"("isActive", "isFeatured");

-- Add foreign key if it doesn't exist (PostgreSQL doesn't have conditional foreign keys, so we try/catch approach)
DO $$
BEGIN
    ALTER TABLE "calculator_materials" ADD CONSTRAINT "calculator_materials_calculatorId_fkey" FOREIGN KEY ("calculatorId") REFERENCES "calculators"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN
    NULL;
END
$$;
