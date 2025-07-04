import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';

const SphereLineVisualization = ({ 
  undulationSpeed = 1.0,
  colorTransition1 = 0.5,
  colorTransition2 = 0.8,
  colorTransition3 = 0.7,
  latitudeLines = 10,
  longitudeLines = 16
}) => {
  const groupRef = useRef();
  const animationProgress = useRef(0);
  const slowTime = useRef(0);
  
  const radius = 150;
  
  // Create latitude lines (horizontal circles from south to north pole)
  const latitudeGeometries = useMemo(() => {
    const geometries = [];
    
    for (let i = 0; i <= latitudeLines; i++) {
      const phi = (i / latitudeLines) * Math.PI; // 0 to PI (south to north)
      const y = radius * Math.cos(phi);
      const currentRadius = radius * Math.sin(phi);
      
      // Create circle geometry for this latitude
      const points = [];
      const segments = 64;
      
      for (let j = 0; j <= segments; j++) {
        const theta = (j / segments) * Math.PI * 2;
        const x = currentRadius * Math.cos(theta);
        const z = currentRadius * Math.sin(theta);
        points.push(new THREE.Vector3(x, y, z));
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      geometries.push(geometry);
    }
    
    return geometries;
  }, [latitudeLines, radius]);
  
  // Create longitude lines (meridians from 0 degrees)
  const longitudeGeometries = useMemo(() => {
    const geometries = [];
    
    for (let i = 0; i < longitudeLines; i++) {
      const theta = (i / longitudeLines) * Math.PI * 2; // 0 to 2PI
      
      // Create semicircle from south to north pole
      const points = [];
      const segments = 32;
      
      for (let j = 0; j <= segments; j++) {
        const phi = (j / segments) * Math.PI; // 0 to PI (south to north)
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        points.push(new THREE.Vector3(x, y, z));
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      geometries.push(geometry);
    }
    
    return geometries;
  }, [longitudeLines, radius]);

  // Create line material with shader
  const lineMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uHueShift: { value: colorTransition1 },
        uSaturation: { value: colorTransition2 },
        uBrightness: { value: colorTransition3 },
        uOpacity: { value: 1.0 }
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        
        void main() {
          vPosition = position;
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uHueShift;
        uniform float uSaturation;
        uniform float uBrightness;
        uniform float uOpacity;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        
        // HSV to RGB conversion
        vec3 hsv2rgb(vec3 c) {
          vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
          vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
          return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }
        
        // RGB to HSV conversion
        vec3 rgb2hsv(vec3 c) {
          vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
          vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
          vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
          float d = q.x - min(q.w, q.y);
          float e = 1.0e-10;
          return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
        }
        
        void main() {
          // Base gradient colors: rgba(252, 185, 0, 1) to rgba(255, 105, 0, 1)
          vec3 color1 = vec3(252.0/255.0, 185.0/255.0, 0.0/255.0); // #fcb900
          vec3 color2 = vec3(255.0/255.0, 105.0/255.0, 0.0/255.0); // #ff6900
          
          // Create gradient based on position
          float gradientFactor = (sin(vPosition.y * 0.01 + uTime * 0.5) + 1.0) * 0.5;
          vec3 baseColor = mix(color1, color2, gradientFactor);
          
          // Apply color transitions
          vec3 hsv = rgb2hsv(baseColor);
          hsv.x = mod(hsv.x + uHueShift, 1.0); // Hue shift
          hsv.y = hsv.y * uSaturation; // Saturation control
          hsv.z = hsv.z * uBrightness; // Brightness control
          
          vec3 finalColor = hsv2rgb(hsv);
          
          // Add some glow effect
          float glow = 1.0 + 0.3 * sin(uTime * 2.0 + vPosition.x * 0.01);
          finalColor *= glow;
          
          gl_FragColor = vec4(finalColor, uOpacity);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
  }, [colorTransition1, colorTransition2, colorTransition3]);

  // Animation effect - animate lines drawing in with tween
  useEffect(() => {
    // Reset animation
    animationProgress.current = 0;
    
    // Animate the drawing of lines
    gsap.to(animationProgress, {
      current: 1,
      duration: 3,
      ease: "power2.out",
      onUpdate: () => {
        // Update material opacity based on progress
        if (lineMaterial.uniforms.uOpacity) {
          lineMaterial.uniforms.uOpacity.value = animationProgress.current;
        }
      }
    });
  }, [latitudeLines, longitudeLines, lineMaterial]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Always update time for continuous animation
    slowTime.current += delta * 0.8 * undulationSpeed;
    
    // Update shader uniforms
    if (lineMaterial.uniforms) {
      lineMaterial.uniforms.uTime.value = slowTime.current;
      lineMaterial.uniforms.uHueShift.value = colorTransition1;
      lineMaterial.uniforms.uSaturation.value = colorTransition2;
      lineMaterial.uniforms.uBrightness.value = colorTransition3;
    }
    
    // Gentle rotation
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * undulationSpeed * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Latitude lines */}
      {latitudeGeometries.map((geometry, index) => (
        <line key={`lat-${index}`}>
          <primitive object={geometry} attach="geometry" />
          <primitive object={lineMaterial} attach="material" />
        </line>
      ))}
      
      {/* Longitude lines */}
      {longitudeGeometries.map((geometry, index) => (
        <line key={`lon-${index}`}>
          <primitive object={geometry} attach="geometry" />
          <primitive object={lineMaterial} attach="material" />
        </line>
      ))}
    </group>
  );
};

export default SphereLineVisualization; 