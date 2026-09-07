# Sistema de Calculadoras Dinámicas

## Descripción General

Se implementó un sistema completo de **calculadoras de materiales dinámicas** que permite:

1. **Admin puede crear, editar y eliminar calculadoras** desde el panel de control
2. **Cada calculadora tiene sus propios materiales y rendimientos** (cantidad por m²)
3. **La interfaz de usuario carga dinámicamente** las calculadoras desde la BD
4. **Los usuarios pueden calcular materiales** ingresando el área en metros cuadrados

## Arquitectura

### Base de Datos (Prisma)

Se agregaron dos nuevos modelos:

```prisma
model Calculator {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  area        Decimal  @db.Decimal(10, 2)  // Área de referencia
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  materials   CalculatorMaterial[]
}

model CalculatorMaterial {
  id          String   @id @default(cuid())
  name        String   // "Plancha", "Ángulos", etc.
  unit        String   // "plancha", "und", "caneca", etc.
  yield       Decimal  @db.Decimal(10, 4)  // Cantidad por m²
  position    Int      @default(0)  // Orden en la lista
  calculatorId String
  calculator   Calculator @relation(fields: [calculatorId], references: [id], onDelete: Cascade)
}
```

### API Endpoints

#### Obtener todas las calculadoras
```
GET /api/calculators
```
Devuelve todas las calculadoras activas con sus materiales.

#### Crear una calculadora
```
POST /api/calculators
Content-Type: application/json

{
  "name": "Gypsum (Pared/Tumbado)",
  "description": "Plancha, estructura y masilla",
  "area": 32,
  "materials": [
    { "name": "Planchas", "unit": "plancha", "yield": 0.35 },
    { "name": "Ángulos", "unit": "und", "yield": 0.6 }
  ]
}
```

#### Obtener una calculadora específica
```
GET /api/calculators/{id}
```

#### Actualizar una calculadora
```
PUT /api/calculators/{id}
Content-Type: application/json

{
  "name": "Nuevo nombre",
  "description": "Nueva descripción",
  "area": 40,
  "isActive": true
}
```

#### Eliminar una calculadora
```
DELETE /api/calculators/{id}
```

#### Agregar un material a una calculadora
```
POST /api/calculators/{id}/materials
Content-Type: application/json

{
  "name": "Material nuevo",
  "unit": "und",
  "yield": 0.5
}
```

#### Actualizar un material
```
PUT /api/calculators/{id}/materials
Content-Type: application/json

{
  "materialId": "mat-123",
  "name": "Nombre actualizado",
  "unit": "und",
  "yield": 0.75,
  "position": 2
}
```

#### Eliminar un material
```
DELETE /api/calculators/{id}/materials?materialId=mat-123
```

## Panel de Admin

### Acceso
- URL: `/admin/calculators`
- Requiere rol ADMIN

### Funcionalidades

1. **Listar Calculadoras**
   - Ver todas las calculadoras disponibles
   - Mostrar: nombre, descripción, área, cantidad de materiales
   - Acciones: editar, eliminar

2. **Crear Nueva Calculadora** (`/admin/calculators/new`)
   - Ingresar nombre, descripción, área
   - Agregar múltiples materiales
   - Especificar nombre, unidad y rendimiento por m²
   - Guardar la calculadora completa

3. **Editar Calculadora** (`/admin/calculators/{id}/edit`)
   - Modificar datos de la calculadora
   - Agregar o eliminar materiales
   - Editar los valores existentes

## Frontend - Calculadora Dinámica

### Componente Principal
- **Archivo**: `src/components/home/DynamicCalculatorSection.tsx`
- **Localización**: Página principal, esquina superior izquierda

### Flujo de Uso

1. **Seleccionar Sistema**: El usuario elige una calculadora del dropdown
2. **Ingresar Área**: Introduce los metros cuadrados (m²)
3. **Calcular**: Presiona "Calcular Materiales"
4. **Ver Resultados**: Se abre un modal con la lista de materiales calculados
5. **Enviar por WhatsApp**: Ingresa nombre y envía la proforma

### Cálculo

```
Para cada material:
Cantidad = Área (m²) × Rendimiento por m²

Ejemplo:
- Planchas: 32 m² × 0.35 plancha/m² = 11 planchas (redondeado)
- Ángulos: 32 m² × 0.6 und/m² = 19 und
```

## Datos Iniciales

Las siguientes calculadoras se crean automáticamente al ejecutar el seed:

1. **Gypsum (Pared/Tumbado)** - 13 materiales
2. **Cielo Raso 1.20×0.60** - 6 materiales
3. **Cielo Raso 60×60** - 7 materiales
4. **Duela PVC 5.95×0.25m** - 8 materiales
5. **Empaste** - 5 materiales

## Ejecución del Seed

Para cargar los datos iniciales:

```bash
npx prisma db seed
```

O después de hacer cambios en el schema:

```bash
npx prisma db push
npx prisma db seed
```

## Flujo Administrativo

### Agregar una nueva calculadora

1. Ir a `/admin/calculators`
2. Hacer clic en "Nueva Calculadora"
3. Ingresar datos:
   - Nombre del sistema (ej: "Pintura sobre Gypsum")
   - Descripción (opcional)
   - Área de referencia en m² (ej: 100)
4. Agregar materiales:
   - Nombre del material
   - Unidad de medida
   - Rendimiento por m² (cantidad necesaria por metro cuadrado)
5. Hacer clic en "Crear Calculadora"

### Ejemplo: Agregar calculadora de Pintura

```
Nombre: "Pintura sobre Gypsum"
Descripción: "Cálculo de pintura y preparación"
Área: 100

Materiales:
1. Pintura - galón - 0.01 galón/m²
2. Sellador - lata - 0.005 lata/m²
3. Lija 150 - und - 0.03 und/m²
4. Primer - galón - 0.008 galón/m²
```

## Modificación de Rendimientos

Si deseas ajustar el rendimiento de un material (ej: cambiar de 0.35 a 0.40 planchas por m²):

1. Ir a `/admin/calculators`
2. Abrir la calculadora correspondiente
3. Editar el material
4. Cambiar el valor de "Rendimiento/m²"
5. Guardar cambios

## Notas Técnicas

- Las calculadoras se guardan en la BD PostgreSQL
- Los cálculos se realizan en el cliente (frontend)
- Los rendimientos se almacenan como Decimal para precisión
- Las posiciones de los materiales determinan el orden de visualización
- Al eliminar una calculadora, sus materiales se eliminan automáticamente (CASCADE)

## Ejemplo de Flujo Completo

1. **Admin crea calculadora**:
   - Nombre: "Cielo Raso Moderno"
   - Añade 6 materiales con sus rendimientos

2. **Usuario accede a la tienda**:
   - Ve la calculadora en la página principal
   - Selecciona "Cielo Raso Moderno"
   - Ingresa 50 m²
   - Le muestra: Planchas: 70, Ángulos: 15, etc.

3. **Usuario solicita proforma**:
   - Ingresa su nombre
   - Presiona "Enviar por WhatsApp"
   - Se abre WhatsApp con la lista formateada
   - Comercial recibe la solicitud

## Mejoras Futuras

- [ ] Agregar categorías/tipos de calculadoras
- [ ] Permitir previsualización en admin
- [ ] Historial de cálculos por usuario
- [ ] Exportar presupuesto en PDF
- [ ] Agregar descuentos por volumen
- [ ] API pública para integraciones externas
