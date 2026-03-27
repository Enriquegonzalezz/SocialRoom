import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, country, industry, phoneCode, phoneNumber } = await request.json();

    console.log('📧 Iniciando envío de email...');
    console.log('Datos recibidos:', { name, email, country, industry, phoneCode, phoneNumber });

    // Validar datos
    if (!name || !email || !country || !industry || !phoneCode || !phoneNumber) {
      console.error('❌ Faltan datos requeridos');
      return NextResponse.json(
        { success: false, message: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // Validar variables de entorno
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('❌ Variables de entorno EMAIL_USER o EMAIL_PASSWORD no configuradas');
      return NextResponse.json(
        { success: false, message: 'Email no configurado en el servidor' },
        { status: 500 }
      );
    }

    console.log('✅ Validación de datos correcta');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);

    // Configurar el transporte de email con Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    console.log('✅ Transporte configurado');

    // Crear el contenido del email en HTML
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #202020; margin-bottom: 20px;">🎉 ¡Nuevo Lead Recibido!</h2>
          
          <p style="color: #666; margin-bottom: 20px;">Se ha recibido un nuevo formulario de contacto con los siguientes datos:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 10px 0;"><strong>Nombre:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>País:</strong> ${country}</p>
            <p style="margin: 10px 0;"><strong>Industria:</strong> ${industry}</p>
            <p style="margin: 10px 0;"><strong>Teléfono:</strong> ${phoneCode} ${phoneNumber}</p>
          </div>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
            Este es un email automático generado por Social Room Agency.
          </p>
        </div>
      </div>
    `;

    // Enviar email a la empresa
    console.log('📤 Enviando email a la empresa...');
    const companyEmailResult = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.COMPANY_EMAIL || process.env.EMAIL_USER,
      subject: `Nuevo Lead: ${name}`,
      html: emailContent,
    });
    console.log('✅ Email a la empresa enviado:', companyEmailResult.messageId);

    // Enviar email de confirmación al cliente
    const clientEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #202020; margin-bottom: 20px;">¡Gracias por tu interés!</h2>
          
          <p style="color: #666; margin-bottom: 20px;">Hola ${name},</p>
          
          <p style="color: #666; margin-bottom: 20px;">
            Hemos recibido tu formulario de contacto y nos pondremos en contacto contigo pronto. 
            Nuestro equipo revisará tu información y te responderá en las próximas 24 horas.
          </p>
          
          <p style="color: #666; margin-bottom: 20px;">
            Mientras tanto, si tienes alguna pregunta urgente, puedes contactarnos a través de WhatsApp.
          </p>
          
          <p style="color: #666;">
            Saludos,<br>
            <strong>Social Room Agency</strong>
          </p>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
            Este es un email automático generado por Social Room Agency.
          </p>
        </div>
      </div>
    `;

    console.log('📤 Enviando email de confirmación al cliente...');
    const clientEmailResult = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirmación de recepción - Social Room Agency',
      html: clientEmailContent,
    });
    console.log('✅ Email al cliente enviado:', clientEmailResult.messageId);

    console.log('🎉 Todos los emails enviados correctamente');
    return NextResponse.json(
      { success: true, message: 'Emails enviados correctamente' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Error enviando email:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response,
    });
    return NextResponse.json(
      { success: false, message: 'Error al enviar el email', error: error.message },
      { status: 500 }
    );
  }
}
