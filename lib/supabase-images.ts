import { supabase } from './supabase';

// Nombre del bucket
const BUCKET_NAME = 'Socialroombucket';

/**
 * Obtiene la URL pública de una imagen en Supabase Storage
 * @param folder - Carpeta dentro del bucket (ej: 'auge', 'enfoque')
 * @param filename - Nombre del archivo (ej: 'auge1.png')
 * @returns URL pública de la imagen
 */
export function getImageUrl(folder: string, filename: string): string {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(`${folder}/${filename}`);

  const url = data.publicUrl;
  
  // Debug: mostrar en consola (solo en desarrollo)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log(`📸 Image URL: ${folder}/${filename} → ${url}`);
  }

  return url;
}

/**
 * Obtiene URLs de múltiples imágenes de una carpeta
 * @param folder - Carpeta dentro del bucket
 * @param filenames - Array de nombres de archivos
 * @returns Array de URLs públicas
 */
export function getImageUrls(folder: string, filenames: string[]): string[] {
  return filenames.map(filename => getImageUrl(folder, filename));
}

/**
 * Obtiene todas las imágenes de un proyecto
 * Útil para cargar imágenes de proyectos como auge1-20, enfoque1-20, etc.
 * @param projectName - Nombre del proyecto (ej: 'auge')
 * @param count - Cantidad de imágenes (ej: 20)
 * @returns Array de URLs públicas
 */
export function getProjectImages(projectName: string, count: number): string[] {
  const urls: string[] = [];
  for (let i = 1; i <= count; i++) {
    const filename = `${projectName}${i}.png`;
    urls.push(getImageUrl(projectName, filename));
  }
  return urls;
}