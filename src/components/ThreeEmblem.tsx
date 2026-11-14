import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeEmblemProps {
  className?: string;
}

export const ThreeEmblem: React.FC<ThreeEmblemProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
        return;
      }
    } catch {
      setWebGLSupported(false);
      return;
    }

    const width = container.clientWidth || 240;
    const height = container.clientHeight || 240;

    // Scene, camera, renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Group for the 3D barber shears / straight-razor emblem
    const emblemGroup = new THREE.Group();
    scene.add(emblemGroup);

    // Materials: Brushed steel & Vintage Copper
    const steelMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.9,
      roughness: 0.25,
    });

    const brassMaterial = new THREE.MeshStandardMaterial({
      color: 0xe68a2e,
      metalness: 0.85,
      roughness: 0.3,
    });

    const darkHandleMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1816,
      metalness: 0.4,
      roughness: 0.6,
    });

    // 1. Outer Ring (Emblem coin border)
    const ringGeo = new THREE.TorusGeometry(1.4, 0.05, 16, 64);
    const ringMesh = new THREE.Mesh(ringGeo, brassMaterial);
    emblemGroup.add(ringMesh);

    // 2. Straight Razor Blade
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(-0.15, -0.9);
    bladeShape.lineTo(0.15, -0.9);
    bladeShape.lineTo(0.18, 0.7);
    bladeShape.lineTo(0.05, 0.85);
    bladeShape.lineTo(-0.15, 0.8);
    bladeShape.closePath();

    const extrudeSettings = {
      depth: 0.04,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    };

    const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);
    bladeGeo.center();
    const bladeMesh = new THREE.Mesh(bladeGeo, steelMaterial);
    bladeMesh.rotation.z = Math.PI / 4;
    emblemGroup.add(bladeMesh);

    // 3. Counter Razor Handle (crossed emblem aesthetic)
    const handleShape = new THREE.Shape();
    handleShape.moveTo(-0.12, -0.9);
    handleShape.lineTo(0.12, -0.9);
    handleShape.lineTo(0.14, 0.75);
    handleShape.lineTo(-0.12, 0.75);
    handleShape.closePath();

    const handleGeo = new THREE.ExtrudeGeometry(handleShape, extrudeSettings);
    handleGeo.center();
    const handleMesh = new THREE.Mesh(handleGeo, darkHandleMaterial);
    handleMesh.rotation.z = -Math.PI / 4;
    emblemGroup.add(handleMesh);

    // 4. Center Brass Rivet
    const rivetGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.15, 32);
    const rivetMesh = new THREE.Mesh(rivetGeo, brassMaterial);
    rivetMesh.rotation.x = Math.PI / 2;
    emblemGroup.add(rivetMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffe2b8, 2.5);
    dirLight1.position.set(4, 5, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xe68a2e, 1.8);
    dirLight2.position.set(-4, -3, 2);
    scene.add(dirLight2);

    // Mouse interaction with smooth lerp
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotationY = x * 0.8;
      targetRotationX = -y * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Performance: Pause when not visible
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const time = clock.getElapsedTime();

      // Continuous subtle idle floating
      const idleY = Math.sin(time * 1.2) * 0.15;
      const idleX = Math.cos(time * 0.9) * 0.1;

      // Smooth damping
      currentRotationX += (targetRotationX + idleX - currentRotationX) * 0.08;
      currentRotationY += (targetRotationY + idleY - currentRotationY) * 0.08;

      emblemGroup.rotation.x = currentRotationX;
      emblemGroup.rotation.y = currentRotationY;
      emblemGroup.position.y = Math.sin(time * 1.5) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      ringGeo.dispose();
      bladeGeo.dispose();
      handleGeo.dispose();
      rivetGeo.dispose();
      steelMaterial.dispose();
      brassMaterial.dispose();
      darkHandleMaterial.dispose();
      renderer.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (!webGLSupported) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <div className="w-24 h-24 rounded-full border border-primary/40 bg-surface-raised flex items-center justify-center text-primary font-display text-2xl shadow-xl">
          ✂
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-40 h-40 md:w-52 md:h-52 cursor-pointer pointer-events-auto select-none ${className}`}
      title="Interactive 3D Master Craft Emblem"
    />
  );
};
