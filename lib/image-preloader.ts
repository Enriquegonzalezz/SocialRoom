/**
 * Utilidades para precargar imágenes de forma eficiente
 */

export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

export function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(src => preloadImage(src)));
}

/**
 * Precargar imágenes con un delay entre cada una para no sobrecargar
 */
export async function preloadImagesWithDelay(
  srcs: string[],
  delayMs: number = 100
): Promise<void[]> {
  const results: Promise<void>[] = [];
  
  for (let i = 0; i < srcs.length; i++) {
    results.push(preloadImage(srcs[i]));
    if (i < srcs.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  return Promise.all(results);
}

/**
 * Precargar imágenes de forma lazy (cuando el usuario las necesita)
 */
export function lazyPreloadImages(srcs: string[], options?: IntersectionObserverInit) {
  if (typeof window === 'undefined') return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const src = entry.target.getAttribute('data-src');
        if (src) {
          preloadImage(src).catch(err => console.warn(err));
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '50px',
    ...options,
  });

  // Crear elementos dummy para observar
  srcs.forEach(src => {
    const dummy = document.createElement('div');
    dummy.setAttribute('data-src', src);
    observer.observe(dummy);
  });
}
