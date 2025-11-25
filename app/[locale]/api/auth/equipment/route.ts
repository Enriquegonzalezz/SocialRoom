import { NextResponse } from 'next/server';

// Misma lógica que en app/api/auth/equipment/route.ts,
// pero con prefijo [locale] para que funcione en /en/api/... y /es/api/...
const EQUIPMENT_CREDENTIALS = {
  email: process.env.EQUIPMENT_EMAIL || 'equipo@socialroom.com',
  password: process.env.EQUIPMENT_PASSWORD || 'SocialRoom2025!'
};

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (email === EQUIPMENT_CREDENTIALS.email && password === EQUIPMENT_CREDENTIALS.password) {
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');

      return NextResponse.json({
        success: true,
        token,
        message: 'Acceso concedido',
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Credenciales incorrectas',
      },
      { status: 401 },
    );
  } catch (error) {
    console.error('Error in equipment auth (locale route):', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error en el servidor',
      },
      { status: 500 },
    );
  }
}
