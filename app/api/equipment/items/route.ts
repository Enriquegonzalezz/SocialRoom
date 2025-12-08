import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Obtener todos los equipos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'available' o 'checked_out'

    let query = supabase
      .from('equipment_items')
      .select('*')
      .order('name', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: items, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      success: true,
      items: items || []
    });
    
  } catch (error: any) {
    console.error('Error fetching equipment items:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Error al obtener los equipos',
      items: []
    }, { status: 500 });
  }
}

// Crear nuevo equipo
export async function POST(request: Request) {
  try {
    const { name, barcode, category } = await request.json();

    if (!name || !barcode || !category) {
      return NextResponse.json({ 
        success: false,
        message: 'Faltan datos requeridos' 
      }, { status: 400 });
    }

    const { data: item, error } = await supabase
      .from('equipment_items')
      .insert({
        name,
        barcode,
        category,
        status: 'available'
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json({ 
          success: false,
          message: 'Ya existe un equipo con ese código de barras' 
        }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({ 
      success: true,
      item,
      message: 'Equipo creado exitosamente'
    });
    
  } catch (error: any) {
    console.error('Error creating equipment item:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Error al crear el equipo' 
    }, { status: 500 });
  }
}
