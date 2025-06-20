import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SphereVisualizer = ({ 
  isActive, 
  undulationSpeed = 1.0,
  colorTransition1 = 0.5,
  colorTransition2 = 0.8,
  colorTransition3 = 0.7
}) => {
  const pointsRef = useRef();
  const slowTime = useRef(0);
  
  console.log('SphereVisualizer rendering:', { isActive });
  
  // Create spherical particle system with inner and outer spheres
  const particles = useMemo(() => {
    console.log('Creating spherical particles...');
    const outerParticles = 1600; // Particles for outer sphere
    const innerParticles = 400;  // Particles for inner sphere (1/6th size = ~1/4 particles)
    const totalParticles = outerParticles + innerParticles;
    
    const outerRadius = 150; // Outer sphere radius
    const innerRadius = outerRadius / 6; // Inner sphere radius (1/6th size)
    
    const positions = new Float32Array(totalParticles * 3);
    const scales = new Float32Array(totalParticles);
    const originalPositions = new Float32Array(totalParticles * 3);
    
    let particleIndex = 0;
    
    // Generate particles on outer sphere surface using Fibonacci spiral
    for (let i = 0; i < outerParticles; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / outerParticles);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      
      const x = outerRadius * Math.sin(phi) * Math.cos(theta);
      const y = outerRadius * Math.sin(phi) * Math.sin(theta);
      const z = outerRadius * Math.cos(phi);
      
      positions[particleIndex * 3] = x;
      positions[particleIndex * 3 + 1] = y;
      positions[particleIndex * 3 + 2] = z;
      
      originalPositions[particleIndex * 3] = x;
      originalPositions[particleIndex * 3 + 1] = y;
      originalPositions[particleIndex * 3 + 2] = z;
      
      scales[particleIndex] = 15; // Original size for outer sphere
      particleIndex++;
    }
    
    // Generate particles on inner sphere surface using Fibonacci spiral
    for (let i = 0; i < innerParticles; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / innerParticles);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      
      const x = innerRadius * Math.sin(phi) * Math.cos(theta);
      const y = innerRadius * Math.sin(phi) * Math.sin(theta);
      const z = innerRadius * Math.cos(phi);
      
      positions[particleIndex * 3] = x;
      positions[particleIndex * 3 + 1] = y;
      positions[particleIndex * 3 + 2] = z;
      
      originalPositions[particleIndex * 3] = x;
      originalPositions[particleIndex * 3 + 1] = y;
      originalPositions[particleIndex * 3 + 2] = z;
      
      scales[particleIndex] = 12; // Slightly smaller particles for inner sphere
      particleIndex++;
    }
    
    console.log('Spherical particles created:', { totalParticles, outerParticles, innerParticles });
    return { 
      positions, 
      scales, 
      originalPositions, 
      numParticles: totalParticles,
      outerRadius,
      innerRadius,
      outerParticles,
      innerParticles
    };
  }, []);

  // Custom shader material for spherical particles
  const particleMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uHueShift: { value: colorTransition1 },
        uSaturation: { value: colorTransition2 },
        uBrightness: { value: colorTransition3 }
      },
      vertexShader: `
        attribute float scale;
        varying vec3 vPosition;
        varying float vScale;
        
        void main() {
          vPosition = position;
          vScale = scale;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = scale * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uHueShift;
        uniform float uSaturation;
        uniform float uBrightness;
        varying vec3 vPosition;
        varying float vScale;
        
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
          vec2 center = vec2(0.5, 0.5);
          float distanceToCenter = length(gl_PointCoord - center);
          
          if (distanceToCenter > 0.5) discard;
          
          // Create gradient based on position and scale
          float gradientFactor = (sin(vPosition.y * 0.01 + uTime * 0.5) + 1.0) * 0.5;
          gradientFactor = mix(0.2, 1.0, gradientFactor);
          
          // Base gradient colors: rgba(252, 185, 0, 1) to rgba(255, 105, 0, 1)
          vec3 color1 = vec3(252.0/255.0, 185.0/255.0, 0.0/255.0); // #fcb900
          vec3 color2 = vec3(255.0/255.0, 105.0/255.0, 0.0/255.0); // #ff6900
          
          vec3 baseColor = mix(color1, color2, gradientFactor);
          
          // Apply color transitions
          vec3 hsv = rgb2hsv(baseColor);
          hsv.x = mod(hsv.x + uHueShift, 1.0); // Hue shift
          hsv.y = hsv.y * uSaturation; // Saturation control
          hsv.z = hsv.z * uBrightness; // Brightness control
          
          vec3 finalColor = hsv2rgb(hsv);
          
          // Add white center for particles
          float centerRadius = 0.15; // Size of white center
          if (distanceToCenter < centerRadius) {
            // White center
            finalColor = vec3(1.0, 1.0, 1.0);
          } else if (distanceToCenter < centerRadius + 0.1) {
            // Smooth transition from white to gradient color
            float transition = (distanceToCenter - centerRadius) / 0.1;
            finalColor = mix(vec3(1.0, 1.0, 1.0), finalColor, transition);
          }
          
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          alpha = pow(alpha, 0.2);
          
          gl_FragColor = vec4(finalColor, alpha * 0.9);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }, [colorTransition1, colorTransition2, colorTransition3]);

  useFrame((state, delta) => {
    if (!pointsRef.current) {
      return;
    }
    
    const positions = pointsRef.current.geometry.attributes.position.array;
    const scales = pointsRef.current.geometry.attributes.scale.array;
    const { numParticles, originalPositions, outerRadius, innerRadius, outerParticles, innerParticles } = particles;
    
    // Always update time for continuous undulation
    slowTime.current += delta * 0.8 * undulationSpeed;
    
    // Update shader uniforms
    if (pointsRef.current && pointsRef.current.material.uniforms) {
      pointsRef.current.material.uniforms.uTime.value = slowTime.current;
      pointsRef.current.material.uniforms.uHueShift.value = colorTransition1;
      pointsRef.current.material.uniforms.uSaturation.value = colorTransition2;
      pointsRef.current.material.uniforms.uBrightness.value = colorTransition3;
    }
    
    for (let i = 0; i < numParticles; i++) {
      const i3 = i * 3;
      const origX = originalPositions[i3];
      const origY = originalPositions[i3 + 1];
      const origZ = originalPositions[i3 + 2];
      
      // Determine if this is an outer or inner sphere particle
      const isOuterSphere = i < outerParticles;
      const baseRadius = isOuterSphere ? outerRadius : innerRadius;
      
      // Calculate spherical coordinates for undulation
      const currentRadius = Math.sqrt(origX * origX + origY * origY + origZ * origZ);
      const phi = Math.acos(origZ / currentRadius);
      const theta = Math.atan2(origY, origX);
      
      // Very gentle undulation that maintains sphere shape - more spherical
      // Inner sphere has slightly different undulation pattern
      const undulationScale = isOuterSphere ? 8 : 4; // Inner sphere has half the undulation
      const secondaryScale = isOuterSphere ? 4 : 2;
      
      const undulationRadius = baseRadius + Math.sin(slowTime.current * 0.5 + phi * 3 + theta * 2) * undulationScale;
      const secondaryUndulation = Math.cos(slowTime.current * 0.7 + phi * 2 + theta * 3) * secondaryScale;
      const finalRadius = undulationRadius + secondaryUndulation;
      
      // Convert back to Cartesian coordinates
      const newX = finalRadius * Math.sin(phi) * Math.cos(theta);
      const newY = finalRadius * Math.sin(phi) * Math.sin(theta);
      const newZ = finalRadius * Math.cos(phi);
      
      if (isActive) {
        // More dramatic pulsing when active - but still more spherical
        // Inner sphere pulses at a different frequency
        const pulseScale = isOuterSphere ? 15 : 8;
        const pulseFreq = isOuterSphere ? 2 : 2.5;
        const activePulse = Math.sin(state.clock.elapsedTime * pulseFreq * undulationSpeed + i * 0.1) * pulseScale;
        const activeRadius = finalRadius + activePulse;
        
        positions[i3] = activeRadius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = activeRadius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = activeRadius * Math.cos(phi);
      } else {
        // Gentle undulation when paused
        positions[i3] = newX;
        positions[i3 + 1] = newY;
        positions[i3 + 2] = newZ;
      }
      
      // Different sizes for inner and outer spheres
      const baseScale = isOuterSphere ? 15 : 12;
      scales[i] = baseScale;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.scale.needsUpdate = true;
  });

  return (
    <group>
      <points ref={pointsRef} material={particleMaterial}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={particles.positions}
            count={particles.numParticles}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-scale"
            array={particles.scales}
            count={particles.numParticles}
            itemSize={1}
          />
        </bufferGeometry>
      </points>
    </group>
  );
};

export default SphereVisualizer; 