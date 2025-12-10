import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Procesar múltiples equipos a la vez
export async function POST(request: Request) {
  try {
    const { barcodes, action, userName } = await request.json();

    // Validar datos
    if (!barcodes || !Array.isArray(barcodes) || barcodes.length === 0) {
      return NextResponse.json({ 
        success: false,
        message: 'No hay equipos para procesar' 
      }, { status: 400 });
    }

    if (!action || !userName) {
      return NextResponse.json({ 
        success: false,
        message: 'Faltan datos requeridos (action, userName)' 
      }, { status: 400 });
    }

    const results: {
      success: any[];
      failed: any[];
    } = {
      success: [],
      failed: []
    };

    // Procesar cada equipo
    for (const barcode of barcodes) {
      try {
        // Buscar el equipo
        const { data: equipment, error: equipmentError } = await supabase
          .from('equipment_items')
          .select('*')
          .eq('barcode', barcode)
          .single();

        if (equipmentError || !equipment) {
          results.failed.push({
            barcode,
            reason: 'Equipo no encontrado'
          });
          continue;
        }

        // Validar estado según acción
        if (action === 'checkout' && equipment.status === 'checked_out') {
          results.failed.push({
            barcode,
            name: equipment.name,
            reason: 'Ya está retirado'
          });
          continue;
        }

        if (action === 'return' && equipment.status === 'available') {
          results.failed.push({
            barcode,
            name: equipment.name,
            reason: 'Ya está disponible'
          });
          continue;
        }

        // Actualizar estado del equipo
        const newStatus = action === 'checkout' ? 'checked_out' : 'available';
        
        const updateData: any = { status: newStatus };
        
        if (action === 'checkout') {
          updateData.checked_out_by = userName;
          updateData.checked_out_at = new Date().toISOString();
        } else {
          updateData.checked_out_by = null;
          updateData.checked_out_at = null;
        }
        
        const { error: updateError } = await supabase
          .from('equipment_items')
          .update(updateData)
          .eq('id', equipment.id);

        if (updateError) {
          results.failed.push({
            barcode,
            name: equipment.name,
            reason: 'Error al actualizar'
          });
          continue;
        }

        // Registrar en el log
        await supabase
          .from('equipment_logs')
          .insert({
            equipment_id: equipment.id,
            barcode: barcode,
            action: action,
            user_name: userName,
            timestamp: new Date().toISOString()
          });

        results.success.push({
          barcode,
          name: equipment.name,
          category: equipment.category,
          status: newStatus
        });

      } catch (err) {
        results.failed.push({
          barcode,
          reason: 'Error inesperado'
        });
      }
    }

    const actionText = action === 'checkout' ? 'retirados' : 'devueltos';
    
    return NextResponse.json({ 
      success: true,
      results,
      message: `${results.success.length} equipo(s) ${actionText} exitosamente${results.failed.length > 0 ? `, ${results.failed.length} fallido(s)` : ''}`
    });
    
  } catch (error: any) {
    console.error('Error in batch scan:', error);
    return NextResponse.json({ 
      success: false,
      message: error.message || 'Error al procesar los equipos' 
    }, { status: 500 });
  }
}
