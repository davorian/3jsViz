import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const HaloVisualization = ({ undulationSpeed, density, color }) => {
  const haloRef = useRef();
  const ringsRef = useRef();

  // Create rainbow halo geometry
  const haloGeometry = useMemo(() => {
    const geometry = new THREE.TorusGeometry(8, 1.5, 16, 100); // Main halo torus
    return geometry;
  }, []);

  // Create rainbow material for halo
  const haloMaterial = useMemo(() => {
    // Create a canvas for rainbow gradient
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 1;
    const context = canvas.getContext('2d');
    
    // Create rainbow gradient
    const gradient = context.createLinearGradient(0, 0, 256, 0);
    gradient.addColorStop(0, '#ff0000');    // Red (inner)
    gradient.addColorStop(0.17, '#ff8800'); // Orange
    gradient.addColorStop(0.33, '#ffff00'); // Yellow
    gradient.addColorStop(0.5, '#00ff00');  // Green
    gradient.addColorStop(0.67, '#0088ff'); // Blue
    gradient.addColorStop(0.83, '#4400ff'); // Indigo
    gradient.addColorStop(1, '#8800ff');    // Violet (outer)
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 1);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.8
    });
  }, []);

  // Generate small rings data
  const ringsData = useMemo(() => {
    const rings = [];
    const numRings = Math.floor(density * 150); // 0 to 150 rings based on density
    
    for (let i = 0; i < numRings; i++) {
      // Random position around the halo
      const angle = Math.random() * Math.PI * 2;
      const haloRadius = 8 + (Math.random() - 0.5) * 3; // Around main halo with some variation
      const height = (Math.random() - 0.5) * 4; // Vertical spread
      
      const x = Math.cos(angle) * haloRadius;
      const z = Math.sin(angle) * haloRadius;
      const y = height;
      
      // Random ring properties
      const radius = 3 + Math.random() * 2; // 3-5 px radius
      const thickness = 1 + Math.random() * 0.5; // 1-1.5 px thickness
      
      // Random color from rainbow spectrum
      const hue = Math.random() * 360;
      const color = new THREE.Color().setHSL(hue / 360, 0.8, 0.6);
      
      rings.push({
        position: [x, y, z],
        radius: radius * 0.1, // Scale down for Three.js units
        thickness: thickness * 0.1,
        color: color,
        rotationSpeed: (Math.random() - 0.5) * 2,
        phase: Math.random() * Math.PI * 2
      });
    }
    
    return rings;
  }, [density]);

  // Animation
  useFrame((state) => {
    const time = state.clock.elapsedTime * undulationSpeed;
    
    // Rotate main halo
    if (haloRef.current) {
      haloRef.current.rotation.y = time * 0.3;
      haloRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
    }
    
    // Animate individual rings
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, index) => {
        const ringData = ringsData[index];
        if (ringData) {
          ring.rotation.x += ringData.rotationSpeed * 0.02;
          ring.rotation.y += ringData.rotationSpeed * 0.015;
          ring.rotation.z += ringData.rotationSpeed * 0.01;
          
          // Subtle floating motion
          const floatOffset = Math.sin(time + ringData.phase) * 0.2;
          ring.position.y = ringData.position[1] + floatOffset;
        }
      });
    }
  });

  return (
    <group>
      {/* Main rainbow halo */}
      <mesh ref={haloRef} geometry={haloGeometry} material={haloMaterial} />
      
      {/* Small rings */}
      <group ref={ringsRef}>
        {ringsData.map((ringData, index) => (
          <mesh key={index} position={ringData.position}>
            <torusGeometry args={[ringData.radius, ringData.thickness, 8, 16]} />
            <meshBasicMaterial 
              color={ringData.color} 
              transparent={true} 
              opacity={0.7}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export default HaloVisualization; 