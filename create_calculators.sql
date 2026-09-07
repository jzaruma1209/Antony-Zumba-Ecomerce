-- Create Calculator table
CREATE TABLE IF NOT EXISTS "public"."calculators" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "slug" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "area" DECIMAL(10,2) NOT NULL DEFAULT 32,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create CalculatorMaterial table
CREATE TABLE IF NOT EXISTS "public"."calculator_materials" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "yield" DECIMAL(10,4) NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "calculatorId" TEXT NOT NULL,
    CONSTRAINT "calculator_materials_calculatorId_fkey"
        FOREIGN KEY ("calculatorId") REFERENCES "public"."calculators"("id")
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create index on calculatorId
CREATE INDEX IF NOT EXISTS "calculator_materials_calculatorId_idx" ON "public"."calculator_materials"("calculatorId");

-- Insert initial calculators
INSERT INTO "public"."calculators" (id, name, slug, description, area, "isActive") VALUES
('calc-1', 'Gypsum (Pared/Tumbado)', 'gypsum-pared-tumbado', 'Plancha, estructura y masilla', 32, true),
('calc-2', 'Cielo Raso 1.20×0.60', 'cielo-raso-120x60', 'Planchas y perfilería', 32, true),
('calc-3', 'Cielo Raso 60×60', 'cielo-raso-60x60', 'Planchas y perfilería', 32, true),
('calc-4', 'Duela PVC 5.95×0.25m', 'duela-pvc-595', 'Duelas y estructura', 32, true),
('calc-5', 'Empaste', 'empaste', 'Empaste, pintura y sellador', 32, true)
ON CONFLICT DO NOTHING;

-- Insert materials for Gypsum
INSERT INTO "public"."calculator_materials" (id, name, unit, yield, position, "calculatorId") VALUES
('mat-1-1', 'Planchas', 'plancha', 0.35, 0, 'calc-1'),
('mat-1-2', 'Ángulos', 'und', 0.6, 1, 'calc-1'),
('mat-1-3', 'Primarios', 'und', 0.24, 2, 'calc-1'),
('mat-1-4', 'Omegas', 'und', 0.45, 3, 'calc-1'),
('mat-1-5', 'Clavos', 'und', 8, 4, 'calc-1'),
('mat-1-6', 'Autoperforantes', 'und', 6, 5, 'calc-1'),
('mat-1-7', 'Tornillo Plancha', 'und', 15, 6, 'calc-1'),
('mat-1-8', 'Masilla', 'caneca', 0.03, 7, 'calc-1'),
('mat-1-9', 'Cinta Fibra Malla', 'und', 0.02, 8, 'calc-1'),
('mat-1-10', 'Cinta Papel', 'und', 0.02, 9, 'calc-1'),
('mat-1-11', 'Lija 150', 'und', 0.05, 10, 'calc-1'),
('mat-1-12', 'Wesco Caneca', 'caneca', 0.01, 11, 'calc-1'),
('mat-1-13', 'Wesco Galón', 'galón', 0.02, 12, 'calc-1')
ON CONFLICT DO NOTHING;

-- Insert materials for Cielo Raso 120x60
INSERT INTO "public"."calculator_materials" (id, name, unit, yield, position, "calculatorId") VALUES
('mat-2-1', 'Planchas Cielo', 'plancha', 1.4, 0, 'calc-2'),
('mat-2-2', 'Ángulos', 'und', 0.3, 1, 'calc-2'),
('mat-2-3', 'Tee 12', 'und', 0.23, 2, 'calc-2'),
('mat-2-4', 'Tee 4', 'und', 1.35, 3, 'calc-2'),
('mat-2-5', 'Clavos', 'und', 8, 4, 'calc-2'),
('mat-2-6', 'Alambre 18', 'rollo', 0.04, 5, 'calc-2')
ON CONFLICT DO NOTHING;

-- Insert materials for Cielo Raso 60x60
INSERT INTO "public"."calculator_materials" (id, name, unit, yield, position, "calculatorId") VALUES
('mat-3-1', 'Planchas Cielo', 'plancha', 1.4, 0, 'calc-3'),
('mat-3-2', 'Ángulos', 'und', 0.3, 1, 'calc-3'),
('mat-3-3', 'Tee 12', 'und', 0.23, 2, 'calc-3'),
('mat-3-4', 'Tee 4', 'und', 1.35, 3, 'calc-3'),
('mat-3-5', 'Tee 2', 'und', 1.35, 4, 'calc-3'),
('mat-3-6', 'Clavos', 'und', 8, 5, 'calc-3'),
('mat-3-7', 'Alambre 18', 'rollo', 0.04, 6, 'calc-3')
ON CONFLICT DO NOTHING;

-- Insert materials for Duela PVC
INSERT INTO "public"."calculator_materials" (id, name, unit, yield, position, "calculatorId") VALUES
('mat-4-1', 'Duelas', 'und', 0.72, 0, 'calc-4'),
('mat-4-2', 'Cornisa', 'und', 0.12, 1, 'calc-4'),
('mat-4-3', 'Ángulos', 'und', 0.6, 2, 'calc-4'),
('mat-4-4', 'Primarios', 'und', 0.24, 3, 'calc-4'),
('mat-4-5', 'Omegas', 'und', 0.45, 4, 'calc-4'),
('mat-4-6', 'Clavos', 'und', 8, 5, 'calc-4'),
('mat-4-7', 'Autoperforantes', 'und', 6, 6, 'calc-4'),
('mat-4-8', 'Autoperforante Punta Aguja', 'und', 10, 7, 'calc-4')
ON CONFLICT DO NOTHING;

-- Insert materials for Empaste
INSERT INTO "public"."calculator_materials" (id, name, unit, yield, position, "calculatorId") VALUES
('mat-5-1', 'Empaste', 'und', 0.05, 0, 'calc-5'),
('mat-5-2', 'Pintura', 'caneca', 0.01, 1, 'calc-5'),
('mat-5-3', 'Sellador', 'galón', 0.02, 2, 'calc-5'),
('mat-5-4', 'Lija 36', 'und', 0.03, 3, 'calc-5'),
('mat-5-5', 'Lija 150 180', 'und', 0.05, 4, 'calc-5')
ON CONFLICT DO NOTHING;
