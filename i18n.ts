export const locales = ['en', 'es'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

// Importar mensajes
import esMessages from './messages/es.json';
import enMessages from './messages/en.json';

export const messages = {
  es: esMessages,
  en: enMessages,
} as const;
