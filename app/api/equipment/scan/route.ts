import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { barcode, action, userName } = await request.json();

    // Validar datos
    if (!barcode || !action || !userName) {
      return NextResponse.json({ 
        success: false,
        message: 'Faltan datos requeridos' 
      }, { status: 400 });
    }

    // Buscar el equipo por código de barras
    const { data: equipment, error: equipmentError } = await supabase
      .from('equipment_items')
      .select('*')
      .eq('barcode', barcode)
      .single();

    if (equipmentError || !equipment) {
      return NextResponse.json({ 
        success: false,
        message: 'Equipo no encontrado. Verifica el código de barras.' 
      }, { status: 404 });
    }

    // Validar estado según acción
    if (action === 'checkout' && equipment.status === 'checked_out') {
      return NextResponse.json({ 
        success: false,
        message: 'Este equipo ya está retirado' 
      }, { status: 400 });
    }

    if (action === 'return' && equipment.status === 'available') {
      return NextResponse.json({ 
        success: false,
        message: 'Este equipo ya está disponible' 
      }, { status: 400 });
    }

    // Actualizar estado del equipo
    const newStatus = action === 'checkout' ? 'checked_out' : 'available';
    
    // Preparar datos de actualización
    const updateData: any = { status: newStatus };
    
    if (action === 'checkout') {
      // Al retirar: guardar quién lo retiró y cuándo
      updateData.checked_out_by = userName;
      updateData.checked_out_at = new Date().toISOString();
    } else {
      // Al devolver: limpiar quién lo tenía
      updateData.checked_out_by = null;
      updateData.checked_out_at = null;
    }
    
    const { error: updateError } = await supabase
      .from('equipment_items')
      .update(updateData)
      .eq('id', equipment.id);

    if (updateError) {
      throw updateError;
    }

    // Registrar en el log
    const { data: log, error: logError } = await supabase
      .from('equipment_logs')
      .insert({
        equipment_id: equipment.id,
        barcode: barcode,
        action: action,
        user_name: userName,
        timestamp: new Date().toISOString()
      })
      .select()
      .single();

    if (logError) {
      throw logError;
    }

    return NextResponse.json({ 
      success: true,
      log,
      equipment: { 
        ...equipment, 
        status: newStatus,
        checked_out_by: action === 'checkout' ? userName : null,
        checked_out_at: action === 'checkout' ? new Date().toISOString() : null
      },
      message: action === 'checkout' 
        ? `${equipment.name} retirado por ${userName}` 
        : `${equipment.name} devuelto exitosamente`
    });
    
  } catch (error: any) {
    console.error('Error in equipment scan:', error);
    return NextResponse.json({ 
      success: false,
      message: error.message || 'Error al procesar el escaneo' 
    }, { status: 500 });
  }
}

// Obtener historial de logs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const { data: logs, error } = await supabase
      .from('equipment_logs')
      .select(`
        *,
        equipment_items (
          name,
          category
        )
      `)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      success: true,
      logs: logs || []
    });
    
  } catch (error: any) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Error al obtener el historial',
      logs: []
    }, { status: 500 });
  }
}
