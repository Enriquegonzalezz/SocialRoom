-- ========================================
-- ACTUALIZACIÓN DE BASE DE DATOS
-- Sistema de Equipos Social Room
-- ========================================

-- 1. Agregar columnas para tracking de quién tiene el equipo
ALTER TABLE equipment_items 
ADD COLUMN IF NOT EXISTS checked_out_by TEXT;

ALTER TABLE equipment_items 
ADD COLUMN IF NOT EXISTS checked_out_at TIMESTAMP WITH TIME ZONE;

-- 2. Eliminar constraint viejo de categorías (si existe)
ALTER TABLE equipment_items 
DROP CONSTRAINT IF EXISTS equipment_items_category_check;

-- 3. Agregar nuevo constraint con las categorías reales de Social Room
ALTER TABLE equipment_items 
ADD CONSTRAINT equipment_items_category_check 
CHECK (category IN (
  'FOTO Y VIDEO',
  'AUDIO - PODCAST',
  'VIDEO - PODCAST',
  'ILUMINACION',
  'ACCESORIO',
  'ACCESORIOS',
  'LENTES',
  'OFICINA',
  'MEMORIA',
  'HARDWARE',
  'COMUNICACIONES'
));

-- 4. Insertar todos los 75 equipos de Social Room
INSERT INTO equipment_items (name, barcode, category, status) VALUES
('CAMERA CANON R5 MARK II', 'SR-EQP-001', 'FOTO Y VIDEO', 'available'),
('MIC SHURE MV7', 'SR-EQP-002', 'AUDIO - PODCAST', 'available'),
('MIC SHURE MV7', 'SR-EQP-003', 'AUDIO - PODCAST', 'available'),
('AMARAN 200X S', 'SR-EQP-004', 'ILUMINACION', 'available'),
('RODECASTER PRO 2', 'SR-EQP-005', 'AUDIO - PODCAST', 'available'),
('RODECASTER VIDEO', 'SR-EQP-006', 'VIDEO - PODCAST', 'available'),
('GODOX FLASH AD600', 'SR-EQP-007', 'ILUMINACION', 'available'),
('SONY ZV-E10 II', 'SR-EQP-008', 'FOTO Y VIDEO', 'available'),
('SONY ZV-E10 II', 'SR-EQP-009', 'FOTO Y VIDEO', 'available'),
('SMALLRIG CAGE', 'SR-EQP-010', 'ACCESORIO', 'available'),
('SMALLRIG CAGE', 'SR-EQP-011', 'ACCESORIO', 'available'),
('CANON RF100mm', 'SR-EQP-012', 'LENTES', 'available'),
('CANON RF50mm', 'SR-EQP-013', 'LENTES', 'available'),
('CANON RF14-35mm', 'SR-EQP-014', 'LENTES', 'available'),
('ONE ODIO AUDIFONO', 'SR-EQP-015', 'AUDIO - PODCAST', 'available'),
('RODE WIRELESS GOII', 'SR-EQP-016', 'AUDIO - PODCAST', 'available'),
('KATASY LABEL PRINT', 'SR-EQP-017', 'OFICINA', 'available'),
('SHURE HEADPHONE', 'SR-EQP-018', 'AUDIO - PODCAST', 'available'),
('WD HARD DRIVE 2TB', 'SR-EQP-019', 'MEMORIA', 'available'),
('GODOX X3 TRIGGER', 'SR-EQP-020', 'FOTO Y VIDEO', 'available'),
('IPAD PRO 11" 1', 'SR-EQP-021', 'HARDWARE', 'available'),
('MACKIE MONITOR CTRL', 'SR-EQP-022', 'AUDIO - PODCAST', 'available'),
('DJI DRONE MINI', 'SR-EQP-023', 'FOTO Y VIDEO', 'available'),
('CLAQUETA', 'SR-EQP-024', 'ACCESORIOS', 'available'),
('KIMARU CARGADOR SONY CAM', 'SR-EQP-025', 'ACCESORIOS', 'available'),
('KIMARU CARGADOR SONY CAM', 'SR-EQP-026', 'ACCESORIOS', 'available'),
('APPLE MAGIC KEYBOARD', 'SR-EQP-027', 'ACCESORIOS', 'available'),
('ELITE TABLE HOLDER', 'SR-EQP-028', 'ACCESORIOS', 'available'),
('IPAD STAND', 'SR-EQP-029', 'ACCESORIOS', 'available'),
('PYLE MEGAPHONE', 'SR-EQP-030', 'ACCESORIOS', 'available'),
('AMARAN 150c COLOR', 'SR-EQP-031', 'ILUMINACION', 'available'),
('AMARAN 150c COLOR', 'SR-EQP-032', 'ILUMINACION', 'available'),
('HP PRINTER 585', 'SR-EQP-033', 'OFICINA', 'available'),
('FILTER FOR DRONE', 'SR-EQP-034', 'ACCESORIOS', 'available'),
('BELKING BLUETOOTH', 'SR-EQP-035', 'ACCESORIOS', 'available'),
('GODOX X3 TRIGGER', 'SR-EQP-036', 'FOTO Y VIDEO', 'available'),
('DJI PRO GIMBAL', 'SR-EQP-037', 'FOTO Y VIDEO', 'available'),
('GODOX FLASH AD200', 'SR-EQP-038', 'FOTO Y VIDEO', 'available'),
('REGLETA', 'SR-EQP-039', 'ACCESORIOS', 'available'),
('REGLETA', 'SR-EQP-040', 'ACCESORIOS', 'available'),
('REGLETA', 'SR-EQP-041', 'ACCESORIOS', 'available'),
('REGLETA', 'SR-EQP-042', 'ACCESORIOS', 'available'),
('MOTOROLA RADIO', 'SR-EQP-043', 'COMUNICACIONES', 'available'),
('MOTOROLA RADIO', 'SR-EQP-044', 'COMUNICACIONES', 'available'),
('MOTOROLA RADIO', 'SR-EQP-045', 'COMUNICACIONES', 'available'),
('METTLE LITE PANEL LED', 'SR-EQP-046', 'ILUMINACION', 'available'),
('CABLE XLR M-F 15FT', 'SR-EQP-047', 'AUDIO - PODCAST', 'available'),
('CABLE XLR - 1/4in 10FT', 'SR-EQP-048', 'AUDIO - PODCAST', 'available'),
('CABLE XLR M-F 35FT', 'SR-EQP-049', 'AUDIO - PODCAST', 'available'),
('CABLE HDMI 5FT', 'SR-EQP-050', 'VIDEO - PODCAST', 'available'),
('CABLE HDMI 15FT', 'SR-EQP-051', 'VIDEO - PODCAST', 'available'),
('CABLE USB-C TO USB-C ANGLE 15FT', 'SR-EQP-052', 'FOTO Y VIDEO', 'available'),
('BATTERY CHARGER CANON', 'SR-EQP-053', 'FOTO Y VIDEO', 'available'),
('CANON R5 BATTERY', 'SR-EQP-054', 'FOTO Y VIDEO', 'available'),
('CANON R5 BATTERY', 'SR-EQP-055', 'FOTO Y VIDEO', 'available'),
('CANON R5 BATTERY', 'SR-EQP-056', 'FOTO Y VIDEO', 'available'),
('CABLE XLR 1/4in 5FT', 'SR-EQP-057', 'AUDIO - PODCAST', 'available'),
('SMALLRIG HANDLE X CAM', 'SR-EQP-058', 'ACCESORIO', 'available'),
('CABLE MICRO HDMI TO HDMI', 'SR-EQP-059', 'FOTO Y VIDEO', 'available'),
('CABLE SPIRAL HDMI CAM TO SCREEN', 'SR-EQP-060', 'FOTO Y VIDEO', 'available'),
('CABLE 3.5mm AUX', 'SR-EQP-061', 'FOTO Y VIDEO', 'available'),
('GODOX S2 MOUNT HODER', 'SR-EQP-062', 'FOTO Y VIDEO', 'available'),
('INNOGEAR MIC STAND', 'SR-EQP-063', 'AUDIO - PODCAST', 'available'),
('APUTURE SOFT BOX SMALL', 'SR-EQP-064', 'ILUMINACION', 'available'),
('APUTURE SOFT BOX SMALL', 'SR-EQP-065', 'ILUMINACION', 'available'),
('APUTURE SOFT BOX LARGE', 'SR-EQP-066', 'ILUMINACION', 'available'),
('GODOX SOMBRILLA', 'SR-EQP-067', 'ILUMINACION', 'available'),
('K&F TRIPOD', 'SR-EQP-068', 'FOTO Y VIDEO', 'available'),
('BACKDROP', 'SR-EQP-069', 'FOTO Y VIDEO', 'available'),
('EMART TRIPOD', 'SR-EQP-070', 'FOTO Y VIDEO', 'available'),
('NEEWER SOFTBOX XL', 'SR-EQP-071', 'FOTO Y VIDEO', 'available'),
('SOFTBOX XL', 'SR-EQP-072', 'FOTO Y VIDEO', 'available'),
('AMARAN PANO 60C COLOR LED', 'SR-EQP-073', 'ILUMINACION', 'available'),
('DJI OSMO POCKET 3', 'SR-EQP-074', 'FOTO Y VIDEO', 'available'),
('DJI OSMO POCKET 3', 'SR-EQP-075', 'FOTO Y VIDEO', 'available')
ON CONFLICT (barcode) DO NOTHING;

-- 5. Verificar que todo se insertó correctamente
SELECT COUNT(*) as total_equipos FROM equipment_items;

-- 6. Ver estructura actualizada de la tabla
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'equipment_items'
ORDER BY ordinal_position;

-- 7. Ver primeros 10 equipos
SELECT id, name, barcode, category, status, checked_out_by, checked_out_at 
FROM equipment_items 
LIMIT 10;
