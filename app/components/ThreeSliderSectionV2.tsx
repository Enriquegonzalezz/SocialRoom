"use client";

import { useRef, useEffect, useMemo, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { getImageUrl, getOptimizedImageUrl } from '@/lib/supabase-images';
import { useTranslation } from '@/app/hooks/useTranslation';
import SectionFooterButton from './SectionFooterButton';
import FeaturedWork from './FeaturedWork';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const projects = [
  {
    title: 'AUGE',
    category: 'branding',
    year: '2025',
    image: getOptimizedImageUrl('auge', 'auge-26.jpg'),
  },
  {
    title: 'LEAP4HUMANITY',
    category: 'BRANDING & SOCIAL MEDIA',
    year: '2025',
    image: getOptimizedImageUrl('L4h', 'Mesa de trabajo 57.png'),
  },
  {
    title: 'LEBLE',
    category: 'BRANDING & SOCIAL MEDIA',
    year: '2025',
    image: getOptimizedImageUrl('leble', 'leble-01.jpg'),
  },
  {
    title: 'LGM',
    category: 'BRANDING & DEVELOPMENT',
    year: '2025',
    image: getOptimizedImageUrl('lgm', 'LGM-22.png'),
  },
  // {
  //   title: 'Enfoque',
  //   category: 'focus',
  //   year: '2025',
  //   image: getImageUrl('enfoque', 'Mesa de trabajo 42.png'),
  // },
  // {
  //   title: 'Supper',
  //   category: 'premium',
  //   year: '2025',
  //   image: getImageUrl('supper', 'Mesa de trabajo 97.png'),
  // },
  // {
  //   title: 'Kitckly',
  //   category: 'food & beverage',
  //   year: '2025',
  //   image: getImageUrl('kitckly', 'Mesa de trabajo 48.png'),
  // },
];

// Verificar soporte WebGL
function isWebGLSupported(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

export default function ThreeSliderSectionV2() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const preloadedImages = useRef<Map<string, HTMLImageElement>>(new Map());

  // Memoizar las líneas traducidas para evitar re-renders innecesarios
  const line1 = t('threeSlider.line1');
  const line2 = t('threeSlider.line2');
  const line3 = t('threeSlider.line3');
  const finalLinesText = useMemo(() => [line1, line2, line3], [line1, line2, line3]);

  // Verificar WebGL y precargar imágenes al montar
  useEffect(() => {
    setWebGLSupported(isWebGLSupported());
    
    // Precargar todas las imágenes inmediatamente
    let loadedCount = 0;
    const totalImages = projects.length;
    
    projects.forEach((project) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.decoding = 'async';
      
      // Usar fetchpriority para las primeras 2 imágenes
      if (loadedCount < 2) {
        img.fetchPriority = 'high';
      }
      
      img.onload = () => {
        preloadedImages.current.set(project.image, img);
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };
      
      img.onerror = () => {
        console.warn(`Failed to preload: ${project.image}`);
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };
      
      img.src = project.image;
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current || !triggerRef.current || typeof window === 'undefined' || !webGLSupported || !imagesLoaded) return;

    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      // Crear escena 3D
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf3f3f3);
      
      // Optimización: Ajustar near/far para mejor precisión de depth buffer
      const camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        100,  // near más alto para mejor precisión
        10000 // far suficiente para la escena
      );
      camera.position.z = 700;

      // WebGL Renderer optimizado
      const renderer = new THREE.WebGLRenderer({ 
        antialias: window.devicePixelRatio < 2, // Solo antialias en pantallas no-retina
        alpha: false, // No necesitamos alpha, mejor performance
        powerPreference: 'high-performance',
        stencil: false, // No usamos stencil buffer
        depth: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      
      // Optimizaciones de render
      renderer.info.autoReset = false; // Control manual de stats
      
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.top = '0';
      containerRef.current.appendChild(renderer.domElement);

      const cardMeshes: THREE.Mesh[] = [];
      const textMeshes: THREE.Group[] = [];
      
      // Distancia entre slides (profundidad en Z)
      const distanceBetweenSlides = 1200;
      // Posición lateral (izquierda/derecha)
      const lateralOffset = 300;

      // Geometrías compartidas (reutilizar para mejor memoria)
      const sharedCardGeometry = new THREE.PlaneGeometry(784, 584);
      const sharedTextGeometry = new THREE.PlaneGeometry(784, 150);
      
      // Track de texturas cargadas para refresh
      let texturesLoaded = 0;
      const totalTextures = projects.length;
      
      projects.forEach((project, index) => {
        // Crear grupo para cada proyecto
        const projectGroup = new THREE.Group();
        
        // Crear canvas para la imagen con bordes redondeados
        const imageCanvas = document.createElement('canvas');
        imageCanvas.width = 800;
        imageCanvas.height = 600;
        const imageCtx = imageCanvas.getContext('2d', { alpha: true });
        
        // Crear textura del canvas con configuración optimizada
        const texture = new THREE.CanvasTexture(imageCanvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.generateMipmaps = false; // No necesitamos mipmaps para planos
        
        // Usar imagen precargada o cargar si no existe
        const preloadedImg = preloadedImages.current.get(project.image);
        
        const processImage = (img: HTMLImageElement) => {
          if (imageCtx) {
            // Limpiar canvas
            imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
            
            // Calcular dimensiones para object-fit: cover
            const canvasRatio = imageCanvas.width / imageCanvas.height;
            const imgRatio = img.width / img.height;
            
            let drawWidth, drawHeight, offsetX, offsetY;
            
            if (imgRatio > canvasRatio) {
              drawHeight = imageCanvas.height;
              drawWidth = img.width * (imageCanvas.height / img.height);
              offsetX = (imageCanvas.width - drawWidth) / 2;
              offsetY = 0;
            } else {
              drawWidth = imageCanvas.width;
              drawHeight = img.height * (imageCanvas.width / img.width);
              offsetX = 0;
              offsetY = (imageCanvas.height - drawHeight) / 2;
            }
            
            // Dibujar imagen
            imageCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            
            // Aplicar bordes redondeados
            const radius = 32;
            imageCtx.globalCompositeOperation = 'destination-in';
            imageCtx.beginPath();
            imageCtx.roundRect(0, 0, imageCanvas.width, imageCanvas.height, radius);
            imageCtx.fill();
            imageCtx.globalCompositeOperation = 'source-over';
            
            // Actualizar textura
            texture.needsUpdate = true;
            
            // Track de carga para refresh
            texturesLoaded++;
            if (texturesLoaded === totalTextures) {
              ScrollTrigger.refresh();
            }
          }
        };
        
        if (preloadedImg && preloadedImg.complete) {
          // Usar imagen ya precargada
          processImage(preloadedImg);
        } else {
          // Fallback: cargar imagen si no está precargada
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.decoding = 'async';
          
          img.onerror = () => {
            console.warn(`Failed to load image: ${project.image}`);
            texturesLoaded++;
            if (texturesLoaded === totalTextures) {
              ScrollTrigger.refresh();
            }
          };
          
          img.onload = () => processImage(img);
          img.src = project.image;
        }
        
        // Material optimizado - FrontSide es suficiente
        const cardMaterial = new THREE.MeshBasicMaterial({ 
          map: texture,
          side: THREE.FrontSide,
          transparent: true,
        });
        
        const cardMesh = new THREE.Mesh(sharedCardGeometry, cardMaterial);
        cardMesh.frustumCulled = true; // Habilitar culling
        projectGroup.add(cardMesh);
        
        // Crear canvas para el texto
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 150;
        const ctx = canvas.getContext('2d', { alpha: true });
        
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Título
          ctx.fillStyle = '#000';
          ctx.font = '300 32px "Social Gothic", Arial, sans-serif';
          ctx.fillText(project.title, 0, 40);
          
          // Categoría y año
          ctx.font = '300 18px "Social Gothic", Arial, sans-serif';
          ctx.fillText(project.category, 0, 75);
          ctx.fillText(project.year, 0, 105);
          
          // Botón +
          ctx.fillStyle = '#1a1a1a';
          ctx.font = '300 60px "Social Gothic", Arial, sans-serif';
          ctx.fillText('+', canvas.width - 80, 70);
        }
        
        // Textura de texto optimizada
        const textTexture = new THREE.CanvasTexture(canvas);
        textTexture.minFilter = THREE.LinearFilter;
        textTexture.generateMipmaps = false;
        
        const textMaterial = new THREE.MeshBasicMaterial({ 
          map: textTexture,
          transparent: true,
          side: THREE.FrontSide
        });
        
        const textMesh = new THREE.Mesh(sharedTextGeometry, textMaterial);
        textMesh.position.y = -367;
        textMesh.frustumCulled = true;
        projectGroup.add(textMesh);
        
        // Posicionar el grupo en el eje Z
        projectGroup.position.z = index * -distanceBetweenSlides;
        
        // Posicionar lateralmente alternado
        projectGroup.position.x = index % 2 === 0 ? lateralOffset : -lateralOffset;
        
        scene.add(projectGroup);
        cardMeshes.push(cardMesh);
        textMeshes.push(projectGroup);
      });

      // Detectar si es móvil para ajustar configuración
      const isMobile = window.innerWidth < 768;
      
      // Timeline con ScrollTrigger - Optimizado para móvil y Mac
      const scrollPerSlide = 800;
const finalExtraScroll = 0; // antes era como “muy largo”, bajalo
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          pin: true,
          pinSpacing: true,
          scrub: isMobile ? 0.3 : 0.8, // Más rápido en móvil para mejor respuesta
          start: 'top top',
          end: `+=${(projects.length - 1) * scrollPerSlide + finalExtraScroll}vh`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          fastScrollEnd: true,
          preventOverlaps: true,
        },
      });

      // Forzar refresh después de que el DOM esté listo (fix para Mac)
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      // Animar cámara (se mueve hacia atrás) - incluye una posición extra para el texto final
    timeline.to(camera.position, {
  z: textMeshes.length * -distanceBetweenSlides + camera.position.z,
  ease: 'linear',
});

      // Animar entrada lateral de tarjetas (todas incluyendo la última)
      textMeshes.forEach((group, index) => {
        if (index > 0) {
          timeline.from(group.position, {
            x: index % 2 === 0 ? 1000 : -1000,
            ease: 'power2.out'
          }, index * 0.15);
        }
      });

      // === Grupo de texto final ===
      const finalTextGroup = new THREE.Group();
      const finalTextMeshes: THREE.Mesh[] = [];

      // Controles para ajustar interletrado e interlineado
      const LETTER_SCALE_X = 0.90;
      const LINE_SPACING = 75;

      // Geometría compartida para texto final
      const finalTextGeometry = new THREE.PlaneGeometry(800, 150);

      finalLinesText.forEach((line, i) => {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 200;
        const ctx = canvas.getContext('2d', { alpha: true });

        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.save();
          ctx.fillStyle = '#000000';
          ctx.font = '700 110px "Social Gothic", "Helvetica", Arial, sans-serif';
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.scale(LETTER_SCALE_X, 1);
          ctx.fillText(line, 0, 0);
          ctx.restore();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        
        const mat = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.FrontSide,
        });

        const mesh = new THREE.Mesh(finalTextGeometry, mat);
        mesh.position.y = (finalLinesText.length - 1) * (LINE_SPACING / 2) - i * LINE_SPACING;
        mesh.frustumCulled = true;
        finalTextGroup.add(mesh);
        finalTextMeshes.push(mesh);
      });

      // Posicionar el grupo una distancia después de la última tarjeta (centrado)
      finalTextGroup.position.set(
        0,           // Centrado horizontalmente
        0,
        projects.length * - distanceBetweenSlides // una posición más allá de la última carta
      );

      scene.add(finalTextGroup);

      // === Animación GSAP para el texto final (mismo efecto que las cartas) ===
      // Entra desde la derecha como las cartas pares
      timeline.from(finalTextGroup.position, {
        x: 0,          // entra desde la derecha como las cartas
        ease: 'power2.out',
      }, projects.length * 0.15);

      // Animar opacidad de cada línea con stagger
      finalTextMeshes.forEach((mesh, index) => {
        timeline.from(mesh.material, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
        }, `<+=${index * 0.15}`);
      });

      // Loop de render optimizado - solo renderizar cuando hay cambios
      let animationFrameId: number;
      let needsRender = true;
      
      // Marcar que necesita render cuando GSAP actualiza
      const markNeedsRender = () => { needsRender = true; };
      gsap.ticker.add(markNeedsRender);
      
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        
        // Solo renderizar si hay cambios
        if (needsRender) {
          renderer.render(scene, camera);
          needsRender = false;
        }
      };
      animate();

      // Resize handler con debounce para Mac
      let resizeTimeout: ReturnType<typeof setTimeout>;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
          ScrollTrigger.refresh();
        }, 100);
      };
      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        // Remover ticker de GSAP
        gsap.ticker.remove(markNeedsRender);
        
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        window.removeEventListener('resize', handleResize);
        
        // Limpiar geometrías compartidas
        sharedCardGeometry.dispose();
        sharedTextGeometry.dispose();
        finalTextGeometry.dispose();
        
        // Limpiar materiales y texturas de cards
        cardMeshes.forEach(mesh => {
          const material = mesh.material as THREE.MeshBasicMaterial;
          if (material.map) material.map.dispose();
          material.dispose();
        });
        
        // Limpiar grupos de proyectos
        textMeshes.forEach(group => {
          group.traverse(child => {
            if (child instanceof THREE.Mesh) {
              const material = child.material as THREE.MeshBasicMaterial;
              if (material.map) material.map.dispose();
              material.dispose();
            }
          });
        });
        
        // Limpiar texto final
        finalTextMeshes.forEach(mesh => {
          const material = mesh.material as THREE.MeshBasicMaterial;
          if (material.map) material.map.dispose();
          material.dispose();
        });
        
        // Dispose del renderer
        renderer.dispose();
        renderer.forceContextLoss();
        if (renderer.domElement?.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        
        ScrollTrigger.getAll().forEach(st => st.kill());
      };
    }, triggerRef);

    return () => ctx.revert();
  }, [finalLinesText, webGLSupported, imagesLoaded]);

  // Fallback para dispositivos sin WebGL - usar FeaturedWork
  if (!webGLSupported) {
    const fallbackProjects = projects.map((project, index) => ({
      id: `project-${index}`,
      title: project.title,
      category: project.category,
      imageUrl: project.image,
      href: '/projects',
    }));

    return (
      <>
        <FeaturedWork projects={fallbackProjects} />
        <div className="bg-[#f3f3f3]">
          <SectionFooterButton section="threeslider" />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Preload hints para las imágenes */}
      {projects.slice(0, 2).map((project, index) => (
        <link 
          key={index}
          rel="preload" 
          href={project.image} 
          as="image"
          crossOrigin="anonymous"
        />
      ))}
      
      <section 
        ref={triggerRef} 
        className="relative w-full bg-[#f3f3f3] overflow-hidden"
        style={{ height: '100vh', touchAction: 'pan-y' }}
      >
        {/* Loading indicator mientras cargan las imágenes */}
        {!imagesLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          </div>
        )}
        
        <div 
          ref={containerRef} 
          className="absolute top-0 left-0 w-full h-full overflow-hidden"
          style={{ willChange: 'transform', touchAction: 'pan-y' }}
        />
      </section>
      {/* Botón de footer de sección - fuera del pin para que aparezca al final */}
      <div className="bg-[#f3f3f3]">
        <SectionFooterButton section="threeslider" />
      </div>
    </>
  );
}
