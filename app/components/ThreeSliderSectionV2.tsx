"use client";

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const projects = [
  {
    title: 'Auge',
    category: 'branding',
    year: '2025',
    image: '/auge1.png',
  },
  {
    title: 'Leap',
    category: 'design',
    year: '2024',
    image: '/leap1.webp',
  },
  {
    title: 'Leble',
    category: 'development',
    year: '2024',
    image: '/leble1.png',
  },
  {
    title: 'LGM',
    category: 'strategy',
    year: '2025',
    image: '/lgm1.png',
  },
  {
    title: 'Enfoque',
    category: 'focus',
    year: '2025',
    image: '/enfoque1.png',
  },
  {
    title: 'Supper',
    category: 'premium',
    year: '2025',
    image: '/supper1.png',
  },
];

export default function ThreeSliderSectionV2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current || !triggerRef.current || typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      // Crear escena 3D
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf3f3f3);
      
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
      camera.position.z = 600;

      // WebGL Renderer - Mejor performance que CSS3DRenderer
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.top = '0';
      containerRef.current.appendChild(renderer.domElement);

      const cardMeshes: THREE.Mesh[] = [];
      const textMeshes: THREE.Group[] = [];
      
      // Distancia entre slides (profundidad en Z)
      const distanceBetweenSlides = 1200;
      // Posición lateral (izquierda/derecha)
      const lateralOffset = 250;

      // Cargar texturas y crear meshes
      const textureLoader = new THREE.TextureLoader();
      
      projects.forEach((project, index) => {
        // Crear grupo para cada proyecto
        const projectGroup = new THREE.Group();
        
        // Crear geometría para la tarjeta (plano) - 800x600px
        const cardGeometry = new THREE.PlaneGeometry(800, 600);
        
        // Crear canvas para la imagen con bordes redondeados
        const imageCanvas = document.createElement('canvas');
        imageCanvas.width = 800;
        imageCanvas.height = 600;
        const imageCtx = imageCanvas.getContext('2d');
        
        // Crear textura del canvas
        const texture = new THREE.CanvasTexture(imageCanvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        
        // Cargar imagen y aplicar bordes redondeados
        const img = document.createElement('img');
        img.crossOrigin = 'anonymous';
        img.src = project.image;
        img.onload = () => {
          if (imageCtx) {
            // Limpiar canvas
            imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
            imageCtx.save();
            
            // Crear path con bordes redondeados de 32px
            const radius = 32;
            imageCtx.beginPath();
            imageCtx.moveTo(radius, 0);
            imageCtx.lineTo(imageCanvas.width - radius, 0);
            imageCtx.arcTo(imageCanvas.width, 0, imageCanvas.width, radius, radius);
            imageCtx.lineTo(imageCanvas.width, imageCanvas.height - radius);
            imageCtx.arcTo(imageCanvas.width, imageCanvas.height, imageCanvas.width - radius, imageCanvas.height, radius);
            imageCtx.lineTo(radius, imageCanvas.height);
            imageCtx.arcTo(0, imageCanvas.height, 0, imageCanvas.height - radius, radius);
            imageCtx.lineTo(0, radius);
            imageCtx.arcTo(0, 0, radius, 0, radius);
            imageCtx.closePath();
            imageCtx.clip();
            
            // Dibujar imagen
            imageCtx.drawImage(img, 0, 0, imageCanvas.width, imageCanvas.height);
            imageCtx.restore();
            
            // Actualizar textura
            texture.needsUpdate = true;
          }
        };
        
        // Material con la textura
        const cardMaterial = new THREE.MeshBasicMaterial({ 
          map: texture,
          side: THREE.DoubleSide,
          transparent: true
        });
        
        const cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);
        projectGroup.add(cardMesh);
        
        // Crear canvas para el texto (150px de alto para el área de texto)
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 150;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Fondo transparente
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Título
          ctx.fillStyle = '#1a1a1a';
          ctx.font = '300 32px "Social Gothic", Arial, sans-serif';
          ctx.fillText(project.title, 0, 40);
          
          // Categoría
          ctx.fillStyle = '#666666';
          ctx.font = '300 18px "Social Gothic", Arial, sans-serif';
          ctx.fillText(project.category, 0, 75);
          
          // Año
          ctx.fillText(project.year, 0, 105);
          
          // Botón + (a la derecha)
          ctx.fillStyle = '#1a1a1a';
          ctx.font = '300 60px "Social Gothic", Arial, sans-serif';
          ctx.fillText('+', canvas.width - 80, 70);
        }
        
        // Crear textura del canvas
        const textTexture = new THREE.CanvasTexture(canvas);
        textTexture.minFilter = THREE.LinearFilter;
        
        // Crear plano para el texto (mismo ancho que la imagen, 150px de alto)
        const textGeometry = new THREE.PlaneGeometry(800, 150);
        const textMaterial = new THREE.MeshBasicMaterial({ 
          map: textTexture,
          transparent: true,
          side: THREE.DoubleSide
        });
        
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.y = -375; // Posicionar debajo de la imagen (600/2 + 150/2)
        projectGroup.add(textMesh);
        
        // Posicionar el grupo en el eje Z
        projectGroup.position.z = index * -distanceBetweenSlides;
        
        // Posicionar lateralmente alternado
        if (index > 0) {
          projectGroup.position.x = index % 2 === 0 ? lateralOffset : -lateralOffset;
        }
        
        scene.add(projectGroup);
        cardMeshes.push(cardMesh);
        textMeshes.push(projectGroup);
      });

      // Timeline con ScrollTrigger
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          pin: true,
          scrub: 0.5,
          start: 'top top',
          end: `+=${(projects.length - 1) * 150}vh`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // Animar cámara (se mueve hacia atrás)
      timeline.to(camera.position, {
        z: (textMeshes.length - 1) * -distanceBetweenSlides + camera.position.z,
        ease: 'linear',
      });

      // Animar entrada lateral de tarjetas
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
      const LETTER_SCALE_X = 0.90; // 1 = normal, <1 letras más juntas, >1 más separadas
      const LINE_SPACING = 70;    // distancia vertical entre líneas

      // Crear un canvas por línea de texto y convertirlo en textura
      const finalLines = ['Hacemos', 'tus ideas', 'realidad'];

      finalLines.forEach((line, i) => {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.save();

          // Color negro y estilo similar a los títulos de SocialRoom (Helvetica bold, tracking-tight)
          ctx.fillStyle = '#000000';
          ctx.font = '700 110px "Helvetica Neue", "Helvetica", Arial, sans-serif';
          ctx.textBaseline = 'middle';

          // Posicionar en vertical y ajustar interletrado con escala en X
          ctx.translate(0, canvas.height / 2);
          ctx.scale(LETTER_SCALE_X, 1);
          ctx.fillText(line, 0, 0);

          ctx.restore();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        const geo = new THREE.PlaneGeometry(800, 150);
        const mat = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
        });

        const mesh = new THREE.Mesh(geo, mat);
        // Separar verticalmente las líneas usando LINE_SPACING
        mesh.position.y = (finalLines.length - 1) * (LINE_SPACING / 2) - i * LINE_SPACING;
        finalTextGroup.add(mesh);
        finalTextMeshes.push(mesh);
      });

      // Posicionar el grupo cerca de la última tarjeta
      finalTextGroup.position.set(
        650,         
        0,
        (projects.length - 1) * -distanceBetweenSlides // misma profundidad que la última
      );

      scene.add(finalTextGroup);

      // === Animación GSAP para el texto final ===
      timeline.from(finalTextGroup.position, {
        x: 500,          // entra desde la izquierda
        ease: 'power3.out',
      }, '+=0.3');

      // Animar opacidad de cada línea con stagger
      finalTextMeshes.forEach((mesh, index) => {
        timeline.from(mesh.material, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
        }, `<+=${index * 0.15}`);
      });

      // Loop de render
      let animationFrameId: number;
      const animate = () => {
        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animate);
      };
      animate();

      // Resize handler
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        window.removeEventListener('resize', handleResize);
        
        // Limpiar geometrías y materiales
        cardMeshes.forEach(mesh => {
          mesh.geometry.dispose();
          if (mesh.material instanceof THREE.MeshBasicMaterial) {
            if (mesh.material.map) mesh.material.map.dispose();
            mesh.material.dispose();
          }
        });
        
        textMeshes.forEach(group => {
          group.children.forEach(child => {
            if (child instanceof THREE.Mesh) {
              child.geometry.dispose();
              if (child.material instanceof THREE.MeshBasicMaterial) {
                if (child.material.map) child.material.map.dispose();
                child.material.dispose();
              }
            }
          });
        });
        
        // Limpiar texto final
        finalTextMeshes.forEach(mesh => {
          mesh.geometry.dispose();
          if (mesh.material instanceof THREE.MeshBasicMaterial) {
            if (mesh.material.map) mesh.material.map.dispose();
            mesh.material.dispose();
          }
        });
        
        // Dispose del renderer
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        
        ScrollTrigger.getAll().forEach(st => st.kill());
      };
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={triggerRef} 
      className="relative w-full bg-[#f3f3f3] overflow-hidden"
      style={{ height: '100vh' }}
    >
      <div ref={containerRef} className="fixed top-0 left-0 w-full h-screen overflow-hidden" />
    </section>
  );
}
