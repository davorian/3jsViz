import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const JellyfishVisualization = ({ 
  undulationSpeed = 1.0, 
  density = 1.0, 
  colorTransition1 = 0.5,
  colorTransition2 = 0.8,
  colorTransition3 = 0.7 
}) => {
  const particlesRef = useRef(); // For photophores
  const environmentalParticlesRef = useRef(); // For environmental particles
  const timeRef = useRef(0);

  // Define constants at component level for access in animation
  // const concentricRings = 16; // More rings to cover full dome + sides - REMOVED (unused)

  // Removed bellGeometry - not needed since dome is made of photophores

  // Create particle system for environmental effects - FIXED SIZE
  const particleSystem = useMemo(() => {
    const particleCount = 150; // FIXED count - no longer depends on density
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions around jellyfish - scaled for larger jellyfish
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 15 + Math.random() * 25; // Much larger radius for bigger jellyfish
      
      positions[i3] = Math.sin(phi) * Math.cos(theta) * radius;
      positions[i3 + 1] = Math.cos(phi) * radius - 5; // Adjusted for larger jellyfish
      positions[i3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;
      
      // Slow floating velocities
      velocities[i3] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
      
      // Soft particle colors
      colors[i3] = 0.4 + Math.random() * 0.3;
      colors[i3 + 1] = 0.7 + Math.random() * 0.3;
      colors[i3 + 2] = 0.9 + Math.random() * 0.1;
      
      sizes[i] = Math.random() * 0.15 + 0.05; // Larger environmental particles
    }
    
    return { positions, velocities, colors, sizes, count: particleCount };
  }, []); // REMOVED density dependency - fixed size

  // Create photophore system - INCREASED COUNT + DUAL RADIAL ARRANGEMENTS
  const photophoreSystem = useMemo(() => {
    const photophores = [];
    
    // PRIMARY CONCENTRIC RINGS (high density)
    const rings = 28; // Much more rings for denser dome
    const maxPhotophoresPerRing = 64; // More photophores per ring
    
    for (let ring = 0; ring < rings; ring++) {
      const ringRadius = (ring / (rings - 1)) * 0.9; // 0 to 0.9
      const photophoresInRing = Math.max(6, Math.floor(maxPhotophoresPerRing * (0.3 + 0.7 * ringRadius)));
      
      for (let i = 0; i < photophoresInRing; i++) {
        const angle = (i / photophoresInRing) * Math.PI * 2;
        
                          // PROPER JELLYFISH BELL SHAPE - Rounded dome with curled inward base
         const normalizedRadius = ringRadius; // 0 to 1
         
         // Create proper bell curve: wide at bottom, rounded at top
         let bellHeight = Math.sqrt(1 - normalizedRadius * normalizedRadius) * 6; // Hemisphere shape
         let bellRadius = normalizedRadius * 10; // Linear expansion to edge
         
         // Add JELLYFISH BELL CURL - rounded downward curve with inward lip
         if (normalizedRadius > 0.2) { // Apply to outer 80% of the bell
           const curlFactor = (normalizedRadius - 0.2) / 0.8; // 0 to 1 for curl region
           
           // Rounded downward curve (more circular, not sharp)
           const downwardCurl = (1 - Math.cos(curlFactor * Math.PI * 0.5)) * 3; // More rounded curve, 3 units max
           bellHeight -= downwardCurl;
           
           // Inward curve at the lip (curves INTO interior, not outward)
           if (normalizedRadius > 0.85) { // Only the very edge (outer 15%)
             const lipFactor = (normalizedRadius - 0.85) / 0.15; // 0 to 1 for lip region
             const lipCurl = Math.sin(lipFactor * Math.PI * 0.5) * 1.5; // Curves back up into interior
             bellHeight += lipCurl; // Lip curves back UP
             bellRadius *= (1 - lipFactor * 0.7); // Lip curves INWARD (not outward)
           } else {
             bellRadius *= (1 - curlFactor * 0.2); // Gentle inward curve for main bell
           }
         }
         
         const x = Math.cos(angle) * bellRadius;
         const z = Math.sin(angle) * bellRadius;
         const y = bellHeight + 2; // Dome sits above center
        
        photophores.push({
          basePosition: { x, y, z },
          color: {
            r: Math.random() * 0.3 + 0.7,
            g: Math.random() * 0.8 + 0.2,
            b: Math.random() * 0.9 + 0.1
          },
          intensity: Math.random() * 0.5 + 0.5,
          phase: Math.random() * Math.PI * 2,
          latIndex: ring,
          lonIndex: i,
          type: 'concentric'
        });
      }
    }
    
         // DOME REINFORCEMENT LINES - Subtle structural lines, not tentacles
     const reinforcementLines = 8; // Fewer, subtle lines
     const photophoresPerLine = 12; // Shorter lines, just for dome structure
     
     for (let line = 0; line < reinforcementLines; line++) {
       const lineAngle = (line / reinforcementLines) * Math.PI * 2;
       
       for (let i = 2; i < photophoresPerLine; i++) { // Start from inner rings only
         const lineRadius = (i / (photophoresPerLine - 1)) * 0.7; // Only cover inner 70% of dome
         
                   // Same proper bell shape as concentric rings with curl
          let bellHeight = Math.sqrt(1 - lineRadius * lineRadius) * 6;
          let bellRadiusAtPoint = lineRadius * 10;
          
                     // Add same JELLYFISH BELL CURL - rounded downward curve with inward lip
           if (lineRadius > 0.2) { // Apply to outer 80% of the bell
             const curlFactor = (lineRadius - 0.2) / 0.8;
             
             // Rounded downward curve (more circular, not sharp)
             const downwardCurl = (1 - Math.cos(curlFactor * Math.PI * 0.5)) * 3; // More rounded curve, 3 units max
             bellHeight -= downwardCurl;
             
             // Inward curve at the lip (curves INTO interior, not outward)
             if (lineRadius > 0.85) { // Only the very edge (outer 15%)
               const lipFactor = (lineRadius - 0.85) / 0.15;
               const lipCurl = Math.sin(lipFactor * Math.PI * 0.5) * 1.5; // Curves back up into interior
               bellHeight += lipCurl; // Lip curves back UP
               bellRadiusAtPoint *= (1 - lipFactor * 0.7); // Lip curves INWARD (not outward)
             } else {
               bellRadiusAtPoint *= (1 - curlFactor * 0.2); // Gentle inward curve for main bell
             }
           }
         
         const x = Math.cos(lineAngle) * bellRadiusAtPoint;
         const z = Math.sin(lineAngle) * bellRadiusAtPoint;
         const y = bellHeight + 2;
         
         photophores.push({
           basePosition: { x, y, z },
           color: {
             r: Math.random() * 0.3 + 0.6,
             g: Math.random() * 0.4 + 0.5,
             b: Math.random() * 0.5 + 0.4
           },
           intensity: Math.random() * 0.3 + 0.5, // Dimmer than main dome
           phase: Math.random() * Math.PI * 2 + line * 0.4,
           latIndex: Math.floor(lineRadius * 10),
           lonIndex: line,
           lineIndex: line,
           linePosition: i,
           type: 'reinforcement'
         });
       }
     }
    
         // CENTRAL TRUNK (MANUBRIUM) - Single feeding tube from dome center
     const trunkLength = 12; // Longer, more prominent trunk
     const trunkSegments = 20; // Smooth detail
     const trunkPhotophoresPerSegment = 12; // Dense circumference for visibility
     
     for (let segment = 0; segment < trunkSegments; segment++) {
       const segmentRatio = segment / (trunkSegments - 1); // 0 to 1
               const trunkRadius = 2.0 * (1 - segmentRatio * 0.6); // Tapers from 2.0 to 0.8 - proportional to larger dome
               const y = 2 - segmentRatio * trunkLength; // Extends downward from dome bottom (y=2 is dome bottom)
       
       for (let i = 0; i < trunkPhotophoresPerSegment; i++) {
         const angle = (i / trunkPhotophoresPerSegment) * Math.PI * 2;
         const x = Math.cos(angle) * trunkRadius;
         const z = Math.sin(angle) * trunkRadius;
         
         photophores.push({
           basePosition: { x, y, z },
           color: {
             r: Math.random() * 0.2 + 0.8, // Very bright white/blue for trunk prominence
             g: Math.random() * 0.3 + 0.7,
             b: Math.random() * 0.4 + 0.6
           },
           intensity: Math.random() * 0.2 + 0.8, // High intensity for visibility
           phase: Math.random() * Math.PI * 2 + segment * 0.2,
           latIndex: segment,
           lonIndex: i,
           segmentIndex: segment,
           trunkPosition: segmentRatio,
           type: 'trunk'
         });
       }
     }
    
    console.log(`Created ${photophores.length} total photophores: ${photophores.filter(p => p.type === 'concentric').length} concentric + ${photophores.filter(p => p.type === 'radial').length} radial + ${photophores.filter(p => p.type === 'trunk').length} trunk`);
    return photophores;
  }, []);

  // Create photophore geometry for rendering
  const photophoreGeometry = useMemo(() => {
    const positions = new Float32Array(photophoreSystem.length * 3);
    const colors = new Float32Array(photophoreSystem.length * 3);
    const sizes = new Float32Array(photophoreSystem.length);
    
    photophoreSystem.forEach((photophore, i) => {
      positions[i * 3] = photophore.basePosition.x;
      positions[i * 3 + 1] = photophore.basePosition.y;
      positions[i * 3 + 2] = photophore.basePosition.z;
      
      colors[i * 3] = photophore.color.r;
      colors[i * 3 + 1] = photophore.color.g;
      colors[i * 3 + 2] = photophore.color.b;
      
      sizes[i] = 0.3 + Math.random() * 0.2; // Larger photophores
    });
    
    return { positions, colors, sizes };
  }, [photophoreSystem]);

  // Animation loop
  useFrame((state, delta) => {
    timeRef.current += delta * undulationSpeed;
    const time = timeRef.current;
    
    // DRAMATIC pulsing and ripple effects
    const mainPulse = Math.sin(time * 1.0) * 0.4 + 1.0; // Much slower, much more dramatic pulse
    const rippleSpeed = time * 1.5;
    
    // Update photophore positions and colors - NO BUFFER RESIZING
    if (particlesRef.current) {
      const photophorePositions = particlesRef.current.geometry.attributes.position.array;
      const colors = particlesRef.current.geometry.attributes.color.array;
      const sizes = particlesRef.current.geometry.attributes.size.array;
      
      // Scale number of active photophores based on density (like other visualizations)
      const totalPhotophores = photophoreSystem.length;
      const activePhotophores = Math.floor(totalPhotophores * density);
      const maxPhotophores = Math.min(activePhotophores, photophorePositions.length / 3);
      
      // Reset all photophores to invisible first
      for (let i = 0; i < totalPhotophores; i++) {
        if (i * 3 + 2 < colors.length) {
          colors[i * 3] = 0;
          colors[i * 3 + 1] = 0;
          colors[i * 3 + 2] = 0;
          sizes[i] = 0;
        }
      }
      
      // Only animate the active photophores based on density
      for (let i = 0; i < maxPhotophores; i++) {
        const photophore = photophoreSystem[i];
        if (!photophore) continue;
        
        const basePos = photophore.basePosition;
        const radius = Math.sqrt(basePos.x * basePos.x + basePos.z * basePos.z);
        const ripple = Math.sin(rippleSpeed + radius * 0.3) * 0.2; // Visible ripple
        
        // Apply different movement patterns based on photophore type
        let pulsedX, pulsedY, pulsedZ;
        
                 if (photophore.type === 'trunk') {
           // TRUNK DYNAMICS: Connected to dome center, follows dome pulsing
           const domeCenterPulse = mainPulse; // Trunk follows dome center pulsing
           
           // Trunk sway and connection to dome center
           const trunkSway = Math.sin(time * 1.8 + photophore.trunkPosition * 1.5) * 0.3;
           
           pulsedX = basePos.x * domeCenterPulse + trunkSway * photophore.trunkPosition;
           pulsedY = (basePos.y + 2) * domeCenterPulse - 2; // Connected to dome bottom
           pulsedZ = basePos.z * domeCenterPulse + trunkSway * 0.5 * photophore.trunkPosition;
           
         } else {
           // DOME DYNAMICS: Standard pulsation and ripple effects
           pulsedX = basePos.x * mainPulse;
           pulsedY = basePos.y * mainPulse + ripple;
           pulsedZ = basePos.z * mainPulse;
         }
        
        photophorePositions[i * 3] = pulsedX;
        photophorePositions[i * 3 + 1] = pulsedY;
        photophorePositions[i * 3 + 2] = pulsedZ;
        
        // CLEAN SYSTEM: Different wave patterns for dome, reinforcement, and trunk
        let intensity;
        
        if (photophore.type === 'concentric') {
          // CONCENTRIC RINGS: BRIGHT metachronal rhythm - much less darkness
          const metachronal = Math.sin(time * 2 + photophore.phase) * 0.4 + 0.6; // 0.6 to 1.0 (much brighter)
          const latWave = Math.sin(time * 1.5 + photophore.latIndex * 0.5) * 0.3 + 0.7; // 0.7 to 1.0
          const lonWave = Math.sin(time * 2.2 + photophore.lonIndex * 0.4) * 0.2 + 0.8; // 0.8 to 1.0
          intensity = photophore.intensity * metachronal * latWave * lonWave;
        } else if (photophore.type === 'reinforcement') {
          // REINFORCEMENT LINES: Brighter structural patterns
          const lineWave = Math.sin(time * 1.5 + photophore.lineIndex * 0.8) * 0.3 + 0.7; // 0.7 to 1.0
          const positionWave = Math.sin(time * 2.0 + photophore.linePosition * 0.6) * 0.2 + 0.8; // 0.8 to 1.0
          intensity = photophore.intensity * lineWave * positionWave;
        } else if (photophore.type === 'trunk') {
          // TRUNK: BRIGHT peristaltic waves along the manubrium
          const peristaltic = Math.sin(time * 3 + photophore.segmentIndex * 0.8) * 0.3 + 0.7; // Brighter digestive waves
          const circumferential = Math.sin(time * 2.5 + photophore.lonIndex * 1.2) * 0.2 + 0.8; // Brighter circumference
          const trunkPulse = Math.sin(time * 1.5 + photophore.trunkPosition * 2) * 0.2 + 0.8; // Brighter pulse
          const trunkGlow = Math.sin(time * 4 + photophore.trunkPosition * 3) * 0.1 + 0.9; // Much brighter glow
          intensity = photophore.intensity * peristaltic * circumferential * trunkPulse * trunkGlow;
        }
        
        colors[i * 3] = photophore.color.r * intensity;
        colors[i * 3 + 1] = photophore.color.g * intensity;
        colors[i * 3 + 2] = photophore.color.b * intensity;
        
        // Size variations based on type
        let baseSize;
        if (photophore.type === 'trunk') {
          baseSize = 1.2; // Trunk largest for feeding structure prominence
        } else if (photophore.type === 'reinforcement') {
          baseSize = 0.8; // Reinforcement lines smaller, subtle
        } else {
          baseSize = 1.0; // Concentric standard
        }
        sizes[i] = baseSize * (1.0 + Math.random() * 0.5) * (0.5 + intensity * 1.5); // Minimum size increased from 0.2 to 0.5
      }
      
      // Mark for update - but don't change array sizes
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.geometry.attributes.color.needsUpdate = true;
      particlesRef.current.geometry.attributes.size.needsUpdate = true;
    }
    
    // Update environmental particle system - FIXED SIZE
    if (environmentalParticlesRef.current) {
      const positions = environmentalParticlesRef.current.geometry.attributes.position.array;
      const { velocities, count } = particleSystem;
      
      // Ensure we don't exceed the fixed buffer size
      const maxParticles = Math.min(count, positions.length / 3);
      
      for (let i = 0; i < maxParticles; i++) {
        const i3 = i * 3;
        
        // Update positions with gentle floating motion
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];
        
        // Boundary conditions - keep particles in view - larger boundaries
        if (Math.abs(positions[i3]) > 40) velocities[i3] *= -0.8;
        if (Math.abs(positions[i3 + 1]) > 40) velocities[i3 + 1] *= -0.8;
        if (Math.abs(positions[i3 + 2]) > 40) velocities[i3 + 2] *= -0.8;
        
        // Add gentle random motion
        velocities[i3] += (Math.random() - 0.5) * 0.0005;
        velocities[i3 + 1] += (Math.random() - 0.5) * 0.0005;
        velocities[i3 + 2] += (Math.random() - 0.5) * 0.0005;
        
        // Damping to prevent particles from moving too fast
        velocities[i3] *= 0.999;
        velocities[i3 + 1] *= 0.999;
        velocities[i3 + 2] *= 0.999;
      }
      
      environmentalParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Dynamic color calculation
  const bellColor = useMemo(() => {
    const hue = colorTransition1 * 360;
    const saturation = Math.max(0.3, colorTransition2) * 100;
    const lightness = Math.max(0.3, colorTransition3) * 60 + 30;
    return new THREE.Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }, [colorTransition1, colorTransition2, colorTransition3]);

  return (
    <group position={[0, 0, 2]}> {/* Moved even closer to camera for better zoom */}
      {/* Jellyfish Bell made entirely of Bioluminescent Photophores */}
      <points ref={particlesRef} position={[0, 0, 0]}> {/* Centered for larger size */}
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={photophoreSystem.length}
            array={photophoreGeometry.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={photophoreSystem.length}
            array={photophoreGeometry.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={photophoreSystem.length}
            array={photophoreGeometry.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.6} // Larger photophore size for better visibility
          transparent={true}
          opacity={0.9}
          vertexColors={true}
          blending={THREE.AdditiveBlending}
          sizeAttenuation={true}
          alphaTest={0.1}
          map={(() => {
            // Create a circular texture for round photophores
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const context = canvas.getContext('2d');
            
            // Create circular gradient
            const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(0.7, 'rgba(255,255,255,0.8)');
            gradient.addColorStop(1, 'rgba(255,255,255,0)');
            
            context.fillStyle = gradient;
            context.fillRect(0, 0, 64, 64);
            
            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            return texture;
          })()}
        />
      </points>
      
      {/* Environmental Particles */}
      <points ref={environmentalParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleSystem.count}
            array={particleSystem.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleSystem.count}
            array={particleSystem.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particleSystem.count}
            array={particleSystem.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12} // Larger environmental particles
          transparent={true}
          opacity={0.5} // More subtle environmental particles
          vertexColors={true}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Enhanced lighting for deep-sea atmosphere - scaled for larger jellyfish */}
      <ambientLight intensity={0.2} color="#001122" /> {/* Dark blue ambient */}
      <pointLight 
        position={[0, 15, 0]} 
        intensity={2.5} 
        color={bellColor} 
        distance={60}
        decay={1}
      />
      <pointLight 
        position={[10, 10, 10]} 
        intensity={1.5} 
        color="#004466" 
        distance={50}
        decay={2}
      />
    </group>
  );
};

export default JellyfishVisualization; 