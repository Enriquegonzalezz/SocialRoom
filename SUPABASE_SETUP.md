# Configuración de Supabase para Sistema de Equipos

## 1. Crear cuenta en Supabase (GRATIS)

1. Ve a https://supabase.com
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto

## 2. Crear tablas en Supabase

Ejecuta estos SQL queries en el SQL Editor de Supabase:

```sql
-- Tabla de equipos
CREATE TABLE equipment_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  barcode TEXT UNIQUE NOT NULL,
  category TEXT CHECK (category IN ('camera', 'microphone', 'tripod', 'lighting', 'other')),
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'checked_out')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de logs (historial)
CREATE TABLE equipment_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id UUID REFERENCES equipment_items(id),
  barcode TEXT NOT NULL,
  action TEXT CHECK (action IN ('checkout', 'return')),
  user_name TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Índices para mejorar performance
CREATE INDEX idx_equipment_barcode ON equipment_items(barcode);
CREATE INDEX idx_logs_timestamp ON equipment_logs(timestamp DESC);
CREATE INDEX idx_logs_equipment ON equipment_logs(equipment_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE equipment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_logs ENABLE ROW LEVEL SECURITY;

-- Políticas: Permitir lectura/escritura a todos (puedes restringir después)
CREATE POLICY "Allow all operations on equipment_items" ON equipment_items FOR ALL USING (true);
CREATE POLICY "Allow all operations on equipment_logs" ON equipment_logs FOR ALL USING (true);
```

## 3. Obtener credenciales

En tu proyecto de Supabase:
1. Ve a Settings > API
2. Copia:
   - Project URL
   - anon/public key

## 4. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu-project-url-aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui

# Credenciales de acceso al sistema de equipos
EQUIPMENT_EMAIL=equipo@socialroom.com
EQUIPMENT_PASSWORD=TuContraseñaSegura123!
```

## 5. Insertar equipos de ejemplo (opcional)

```sql
INSERT INTO equipment_items (name, barcode, category) VALUES
  ('Canon EOS R5', 'CAM001', 'camera'),
  ('Sony A7III', 'CAM002', 'camera'),
  ('Rode NTG4+', 'MIC001', 'microphone'),
  ('Shure SM7B', 'MIC002', 'microphone'),
  ('Manfrotto 055', 'TRI001', 'tripod'),
  ('Godox SL-60W', 'LIG001', 'lighting');
```

## 6. Rutas del sistema

- Login: `/en/equipment/login` o `/es/equipment/login`
- Dashboard: `/en/equipment/dashboard` o `/es/equipment/dashboard`

## 7. Credenciales por defecto

```
Email: equipo@socialroom.com
Password: (la que configures en .env.local)
```

## Costos

✅ **TODO GRATIS** con el plan gratuito de Supabase:
- 500 MB de base de datos
- 1 GB de almacenamiento
- 2 GB de transferencia/mes
- API REST automática
- Autenticación incluida

Para tu caso de uso (gestión de equipos), esto es más que suficiente.
