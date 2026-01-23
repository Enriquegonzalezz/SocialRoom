# Configuración de Tabla Lead en Supabase

## Script SQL para crear la tabla lead

Ejecuta este SQL query en el SQL Editor de Supabase:

```sql
-- Tabla de leads
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  industry TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_code TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  privacy_accepted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas por email
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Política: Permitir inserción a todos (anon puede crear leads)
CREATE POLICY "Allow insert for all" ON leads FOR INSERT WITH CHECK (true);

-- Política: Permitir lectura solo a usuarios autenticados (opcional)
CREATE POLICY "Allow read for authenticated users" ON leads FOR SELECT USING (auth.role() = 'authenticated');
```

## Campos de la tabla

- **id**: UUID único generado automáticamente
- **name**: Nombre del lead
- **country**: País seleccionado
- **industry**: Industria/sector
- **email**: Correo electrónico
- **phone_code**: Código de país del teléfono (+1, +34, etc.)
- **phone_number**: Número de teléfono
- **privacy_accepted**: Si aceptó la política de privacidad
- **created_at**: Fecha y hora de creación

## Notas

- La tabla permite que usuarios anónimos (sin autenticación) puedan insertar leads
- Solo usuarios autenticados pueden leer los leads (para proteger la información)
- Los índices mejoran el rendimiento de búsquedas
