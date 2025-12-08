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
    const { error: updateError } = await supabase
      .from('equipment_items')
      .update({ status: newStatus })
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
      equipment: { ...equipment, status: newStatus },
      message: action === 'checkout' 
        ? `${equipment.name} retirado exitosamente` 
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
