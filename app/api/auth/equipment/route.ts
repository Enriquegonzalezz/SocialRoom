import { NextResponse } from 'next/server';

// Credenciales desde variables de entorno
const EQUIPMENT_CREDENTIALS = {
  email: process.env.EQUIPMENT_EMAIL || 'equipo@socialroom.com',
  password: process.env.EQUIPMENT_PASSWORD || 'SocialRoom2025!'
};

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validar credenciales
    if (email === EQUIPMENT_CREDENTIALS.email && 
        password === EQUIPMENT_CREDENTIALS.password) {
      
      // Generar token simple (en producción podrías usar JWT)
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
      
      return NextResponse.json({ 
        success: true,
        token,
        message: 'Acceso concedido'
      });
    }

    return NextResponse.json({ 
      success: false,
      message: 'Credenciales incorrectas' 
    }, { status: 401 });
    
  } catch (error) {
    console.error('Error in equipment auth:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Error en el servidor' 
    }, { status: 500 });
  }
}
