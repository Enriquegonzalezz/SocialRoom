# Email Notification Setup

## Descripción
Sistema de notificación por email que envía un correo a la empresa cuando se completa el formulario de contacto, con un email de confirmación al cliente.

## Variables de Entorno Requeridas

Agrega las siguientes variables a tu archivo `.env.local`:

```
# Gmail Configuration
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_contraseña_de_aplicacion
COMPANY_EMAIL=info@socialroomagency.com
```

## Cómo Configurar Gmail

### Paso 1: Habilitar autenticación de 2 factores
1. Ve a https://myaccount.google.com/security
2. Habilita "Verificación en dos pasos"

### Paso 2: Crear contraseña de aplicación
1. Ve a https://myaccount.google.com/apppasswords
2. Selecciona "Mail" y "Windows Computer" (o tu dispositivo)
3. Google generará una contraseña de 16 caracteres
4. Copia esa contraseña y úsala como `EMAIL_PASSWORD`

### Paso 3: Configurar variables de entorno
```
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx (la contraseña de 16 caracteres sin espacios)
COMPANY_EMAIL=info@socialroomagency.com
```

## Instalación de Dependencias

```bash
npm install
```

## Flujo de Funcionamiento

1. Usuario completa el formulario de contacto
2. Los datos se guardan en Supabase
3. Se envía un email a la empresa con los datos del lead
4. Se envía un email de confirmación al cliente
5. Se muestra el modal de agradecimiento

## Emails Enviados

### Email a la Empresa
- **Para:** `COMPANY_EMAIL` (info@socialroomagency.com)
- **Asunto:** "Nuevo Lead: [Nombre del cliente]"
- **Contenido:** Datos completos del formulario (nombre, email, país, industria, teléfono)

### Email al Cliente
- **Para:** Email del cliente
- **Asunto:** "Confirmación de recepción - Social Room Agency"
- **Contenido:** Mensaje de agradecimiento y confirmación de recepción

## Troubleshooting

### Error: "Invalid login credentials"
- Verifica que `EMAIL_PASSWORD` sea la contraseña de aplicación de 16 caracteres
- Asegúrate de haber habilitado autenticación de 2 factores

### Error: "Less secure app access"
- Gmail requiere contraseña de aplicación, no la contraseña normal de la cuenta
- Sigue los pasos en "Cómo Configurar Gmail"

### Los emails no se envían
- Verifica que las variables de entorno estén correctamente configuradas en `.env.local`
- Revisa la consola del servidor para mensajes de error
- Asegúrate de que `npm install` haya instalado `nodemailer`
