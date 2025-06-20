import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const WaveVisualizer = ({ 
  isActive, 
  animationType = 'wave', 
  undulationSpeed = 1.0,
  fibonacciDensity = 1.0,
  density = 1.0,
  rotationSpeed = 1.0,
  lineLength = 1.0,
  colorTransition1 = 0.5,
  colorTransition2 = 0.8,
  colorTransition3 = 0.7,
  spiralParams = {}
}) => {
  const pointsRef = useRef();
  const count = useRef(0);
  const slowTime = useRef(0);
  
  console.log('WaveVisualizer rendering:', { isActive, animationType });
  
  // Create particle system based on animation type
  const particles = useMemo(() => {
    console.log('Creating particles for:', animationType);
    
    // Use maximum buffer size for all animation types to avoid resize issues
    const MAX_PARTICLES = 15000; // Much larger buffer for dense icosahedron
    
    const positions = new Float32Array(MAX_PARTICLES * 3);
    const scales = new Float32Array(MAX_PARTICLES);
    const originalPositions = new Float32Array(MAX_PARTICLES * 3);
    
    let actualParticles = 0;
    let animationData = {};
    
    if (animationType === 'puncture') {
      // Puncture animation - 30x30 grid for surface effect
      const SEPARATION = 20;
      const AMOUNTX = 30;
      const AMOUNTY = 30;
      actualParticles = AMOUNTX * AMOUNTY;
      animationData = { AMOUNTX, AMOUNTY, SEPARATION };
      
      let i = 0, j = 0;
      
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
          const y = 0;
          const z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
          
          positions[i] = x;
          positions[i + 1] = y;
          positions[i + 2] = z;
          
          originalPositions[i] = x;
          originalPositions[i + 1] = y;
          originalPositions[i + 2] = z;
          
          scales[j] = 18;
          
          i += 3;
          j++;
        }
      }
      
    } else if (animationType === 'wave') {
      // Wave animation - 40x40 grid
      const SEPARATION = 15;
      const AMOUNTX = 40;
      const AMOUNTY = 40;
      actualParticles = AMOUNTX * AMOUNTY;
      animationData = { AMOUNTX, AMOUNTY, SEPARATION };
      
      let i = 0, j = 0;
      
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
          const y = 0;
          const z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
          
          positions[i] = x;
          positions[i + 1] = y;
          positions[i + 2] = z;
          
          originalPositions[i] = x;
          originalPositions[i + 1] = y;
          originalPositions[i + 2] = z;
          
          scales[j] = 20;
          
          i += 3;
          j++;
        }
      }
      
    } else if (animationType === 'stretch') {
      // Stretch animation - 30x20 grid
      const SEPARATION = 18;
      const AMOUNTX = 30;
      const AMOUNTY = 20;
      actualParticles = AMOUNTX * AMOUNTY;
      animationData = { AMOUNTX, AMOUNTY, SEPARATION };
      
      let i = 0, j = 0;
      
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
          const y = 0;
          const z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
          
          positions[i] = x;
          positions[i + 1] = y;
          positions[i + 2] = z;
          
          originalPositions[i] = x;
          originalPositions[i + 1] = y;
          originalPositions[i + 2] = z;
          
          scales[j] = 18;
          
          i += 3;
          j++;
        }
      }
      
    } else if (animationType === 'cube') {
      // Cube animation - hollow cube (surface only)
      const cubeSize = 300;
      const spacing = 20;
      const particlesPerSide = Math.floor(cubeSize / spacing);
      animationData = { cubeSize, spacing, particlesPerSide };
      
      let particleIndex = 0;
      
      // Generate cube faces
      for (let face = 0; face < 6; face++) {
        for (let i = 0; i < particlesPerSide; i++) {
          for (let j = 0; j < particlesPerSide; j++) {
            if (particleIndex >= MAX_PARTICLES) break;
            
            let x, y, z;
            
            const u = (i / (particlesPerSide - 1)) * cubeSize - cubeSize / 2;
            const v = (j / (particlesPerSide - 1)) * cubeSize - cubeSize / 2;
            
            switch (face) {
              case 0: // Front face
                x = u; y = v; z = cubeSize / 2;
                break;
              case 1: // Back face
                x = u; y = v; z = -cubeSize / 2;
                break;
              case 2: // Right face
                x = cubeSize / 2; y = v; z = u;
                break;
              case 3: // Left face
                x = -cubeSize / 2; y = v; z = u;
                break;
              case 4: // Top face
                x = u; y = cubeSize / 2; z = v;
                break;
              case 5: // Bottom face
                x = u; y = -cubeSize / 2; z = v;
                break;
              default:
                x = 0; y = 0; z = 0;
            }
            
            const i3 = particleIndex * 3;
            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;
            
            originalPositions[i3] = x;
            originalPositions[i3 + 1] = y;
            originalPositions[i3 + 2] = z;
            
            scales[particleIndex] = 15;
            particleIndex++;
          }
        }
      }
      
      actualParticles = particleIndex;
      
    } else if (animationType === 'icosahedron') {
      // Icosahedron animation - 3D icosahedron with face tessellation
      const radius = 180;
      const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
      
      // Icosahedron vertices (12 vertices)
      const icosahedronVertices = [
        [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
        [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
        [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
      ];
      
      // Normalize and scale vertices
      const vertices = icosahedronVertices.map(v => {
        const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        return [
          (v[0] / length) * radius,
          (v[1] / length) * radius,
          (v[2] / length) * radius
        ];
      });
      
      // Define icosahedron faces (20 triangular faces) - proper closed surface
      const faces = [
        // Top cap (5 triangles around vertex 0)
        [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
        // Upper belt (5 triangles)
        [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
        // Lower belt (5 triangles)
        [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
        // Bottom cap (5 triangles around vertex 3)
        [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
      ];
      
      let particleIndex = 0;
      const faceParticles = []; // Store face data for animation
      
      // Create particles on each triangular face using proper tessellation
      for (let f = 0; f < faces.length && particleIndex < MAX_PARTICLES - 100; f++) {
        const [v1, v2, v3] = faces[f];
        const vert1 = vertices[v1];
        const vert2 = vertices[v2];
        const vert3 = vertices[v3];
        
        const faceStartIndex = particleIndex;
        const resolution = 35; // Ultra-high resolution for complete surface
        
        // Create a proper triangular tessellation
        for (let i = 0; i <= resolution; i++) {
          for (let j = 0; j <= resolution - i; j++) {
            if (particleIndex >= MAX_PARTICLES - 1) break;
            
            // Barycentric coordinates for proper triangle tessellation
            const u = i / resolution;
            const v = j / resolution;
            const w = 1 - u - v;
            
            if (w >= 0 && u >= 0 && v >= 0) { // Valid barycentric coordinates
              // Calculate position using barycentric interpolation
              const x = vert1[0] * w + vert2[0] * u + vert3[0] * v;
              const y = vert1[1] * w + vert2[1] * u + vert3[1] * v;
              const z = vert1[2] * w + vert2[2] * u + vert3[2] * v;
              
              const i3 = particleIndex * 3;
              positions[i3] = x;
              positions[i3 + 1] = y;
              positions[i3 + 2] = z;
              
              originalPositions[i3] = x;
              originalPositions[i3 + 1] = y;
              originalPositions[i3 + 2] = z;
              
              scales[particleIndex] = 8; // Original smaller particles for denser coverage
              particleIndex++;
            }
          }
        }
        
        // Store face data for undulation
        faceParticles.push({
          faceIndex: f,
          startIndex: faceStartIndex,
          endIndex: particleIndex - 1,
          center: [
            (vert1[0] + vert2[0] + vert3[0]) / 3,
            (vert1[1] + vert2[1] + vert3[1]) / 3,
            (vert1[2] + vert2[2] + vert3[2]) / 3
          ],
          normal: [ // Face normal for undulation direction
            ((vert2[1] - vert1[1]) * (vert3[2] - vert1[2]) - (vert2[2] - vert1[2]) * (vert3[1] - vert1[1])),
            ((vert2[2] - vert1[2]) * (vert3[0] - vert1[0]) - (vert2[0] - vert1[0]) * (vert3[2] - vert1[2])),
            ((vert2[0] - vert1[0]) * (vert3[1] - vert1[1]) - (vert2[1] - vert1[1]) * (vert3[0] - vert1[0]))
          ]
        });
      }
      
      actualParticles = particleIndex;
      animationData = { radius, phi, faceParticles, vertices, faces };
      
    } else if (animationType === 'oblate') {
      // Oblate spheroid animation - flattened sphere with organic ripples
      const baseParticles = 3500; // Dense particle coverage
      const numParticles = Math.floor(baseParticles * density);
      const radiusX = 180; // Wider radius
      const radiusY = 120; // Flattened height
      const radiusZ = 180; // Wider radius
      
      actualParticles = Math.min(numParticles, MAX_PARTICLES - 100);
      animationData = { radiusX, radiusY, radiusZ, numParticles: actualParticles };
      
      // Generate particles on oblate spheroid surface using spherical coordinates
      for (let i = 0; i < actualParticles; i++) {
        // Use Fibonacci spiral for even distribution
        const phi = Math.acos(1 - 2 * (i + 0.5) / actualParticles);
        const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
        
        // Convert to oblate spheroid coordinates
        const x = radiusX * Math.sin(phi) * Math.cos(theta);
        const y = radiusY * Math.cos(phi); // Flattened Y axis
        const z = radiusZ * Math.sin(phi) * Math.sin(theta);
        
        const i3 = i * 3;
        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
        
        originalPositions[i3] = x;
        originalPositions[i3 + 1] = y;
        originalPositions[i3 + 2] = z;
        
        scales[i] = 12; // Smaller particles for organic detail
      }
      
    } else if (animationType === 'fibonacci_sphere') {
      // Perfect sphere with Fibonacci spiral distribution + inner sphere
      const outerSphereParticles = Math.floor(1600 * fibonacciDensity);
      const innerSphereParticles = Math.floor(400 * fibonacciDensity);
      const outerRadius = 180;
      const innerRadius = outerRadius / 6; // Inner sphere is 1/6th the size
      
      actualParticles = Math.min(outerSphereParticles + innerSphereParticles, MAX_PARTICLES - 100);
      animationData = { 
        outerRadius, 
        innerRadius, 
        outerSphereParticles, 
        innerSphereParticles,
        numParticles: actualParticles 
      };
      
      // Generate particles using Fibonacci spiral on sphere
      const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Golden angle in radians
      let particleIndex = 0;
      
      // Outer sphere particles
      for (let i = 0; i < outerSphereParticles && particleIndex < actualParticles; i++) {
        // Fibonacci spiral distribution
        const y = 1 - (i / (outerSphereParticles - 1)) * 2; // y goes from 1 to -1
        const radiusAtY = Math.sqrt(1 - y * y);
        
        const theta = goldenAngle * i; // Golden angle increment
        
        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;
        
        // Scale to desired radius
        const scaledX = x * outerRadius;
        const scaledY = y * outerRadius;
        const scaledZ = z * outerRadius;
        
        const i3 = particleIndex * 3;
        positions[i3] = scaledX;
        positions[i3 + 1] = scaledY;
        positions[i3 + 2] = scaledZ;
        
        originalPositions[i3] = scaledX;
        originalPositions[i3 + 1] = scaledY;
        originalPositions[i3 + 2] = scaledZ;
        
        scales[particleIndex] = 15;
        particleIndex++;
      }
      
      // Inner sphere particles
      for (let i = 0; i < innerSphereParticles && particleIndex < actualParticles; i++) {
        // Fibonacci spiral distribution for inner sphere
        const y = 1 - (i / (innerSphereParticles - 1)) * 2; // y goes from 1 to -1
        const radiusAtY = Math.sqrt(1 - y * y);
        
        const theta = goldenAngle * i * 1.618; // Different phase for visual distinction
        
        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;
        
        // Scale to inner radius
        const scaledX = x * innerRadius;
        const scaledY = y * innerRadius;
        const scaledZ = z * innerRadius;
        
        const i3 = particleIndex * 3;
        positions[i3] = scaledX;
        positions[i3 + 1] = scaledY;
        positions[i3 + 2] = scaledZ;
        
        originalPositions[i3] = scaledX;
        originalPositions[i3 + 1] = scaledY;
        originalPositions[i3 + 2] = scaledZ;
        
        scales[particleIndex] = 12; // Slightly smaller particles for inner sphere
        particleIndex++;
      }
      
    } else if (animationType === 'fibonacci_disc') {
      // Circular disc with Fibonacci spiral distribution from center
      const baseParticles = 1500;
      const numParticles = Math.floor(baseParticles * fibonacciDensity);
      const maxRadius = 200;
      
      actualParticles = Math.min(numParticles, MAX_PARTICLES - 100);
      animationData = { maxRadius, numParticles: actualParticles };
      
      // Generate particles using Fibonacci spiral on disc
      const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Golden angle in radians
      
      for (let i = 0; i < actualParticles; i++) {
        // Fibonacci spiral from center outward
        const r = Math.sqrt(i / (actualParticles - 1)) * maxRadius; // Square root for even distribution
        const theta = goldenAngle * i; // Golden angle increment
        
        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);
        const y = 0; // Flat disc
        
        const i3 = i * 3;
        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
        
        originalPositions[i3] = x;
        originalPositions[i3 + 1] = y;
        originalPositions[i3 + 2] = z;
        
        scales[i] = 16;
      }
      
    } else if (animationType === 'biconvex_disc') {
      // Biconvex disc with Fibonacci distribution (outward curves)
      const baseParticles = 2500;
      const numParticles = Math.floor(baseParticles * fibonacciDensity);
      const maxRadius = 180;
      const convexity = 0.3; // Depth of convex curves
      
      actualParticles = Math.min(numParticles, MAX_PARTICLES - 100);
      animationData = { maxRadius, convexity, numParticles: actualParticles };
      
      // Generate particles using Fibonacci spiral with biconvex height
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      
      for (let i = 0; i < actualParticles; i++) {
        const r = Math.sqrt(i / (actualParticles - 1)) * maxRadius;
        const theta = goldenAngle * i;
        
        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);
        
        // Biconvex height function: y = ±convexity * (1 - (r/maxRadius)²)
        const normalizedR = r / maxRadius;
        const heightFactor = convexity * (1 - normalizedR * normalizedR) * maxRadius;
        
        // Alternate between top and bottom surfaces
        const y = (i % 2 === 0 ? 1 : -1) * heightFactor;
        
        const i3 = i * 3;
        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
        
        originalPositions[i3] = x;
        originalPositions[i3 + 1] = y;
        originalPositions[i3 + 2] = z;
        
        scales[i] = 14;
      }
      
    } else if (animationType === 'biconcave_disc') {
      // True biconcave disc using Evans & Fung 1972 formula for red blood cell shape
      const baseParticles = 2500;
      const numParticles = Math.floor(baseParticles * fibonacciDensity);
      const R = 180; // Maximum radius of the disk
      
      // Evans & Fung 1972 coefficients for red blood cell shape
      const z0 = 15; // Overall height scale (scaled for visualization)
      const c0 = 0.81;
      const c1 = 7.83;
      const c2 = -4.39;
      
      actualParticles = Math.min(numParticles, MAX_PARTICLES - 100);
      animationData = { R, z0, c0, c1, c2, numParticles: actualParticles };
      
      // Generate particles using parametric form for 3D modeling
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      
      for (let i = 0; i < actualParticles; i++) {
        // Use Fibonacci spiral for even distribution
        const u = Math.sqrt(i / (actualParticles - 1)); // Radial parameter [0, 1]
        const v = goldenAngle * i; // Angular parameter
        
        // Parametric form: r(u) = u * R
        const r = u * R;
        const normalizedR = r / R; // r/R for the formula
        
        // Evans & Fung 1972 biconcave disc formula:
        // z(r) = ±z0 * (1 - (r/R)²) * [c0 + c1*(r/R)² + c2*(r/R)⁴]
        const rOverR_squared = normalizedR * normalizedR;
        const rOverR_fourth = rOverR_squared * rOverR_squared;
        
        const heightFactor = (1 - rOverR_squared) * (c0 + c1 * rOverR_squared + c2 * rOverR_fourth);
        const zHeight = z0 * heightFactor;
        
        // 3D parametric coordinates
        const x = r * Math.cos(v);
        const z = r * Math.sin(v);
        
        // Create both top and bottom surfaces
        const y = (i % 2 === 0 ? 1 : -1) * Math.abs(zHeight);
        
        const i3 = i * 3;
        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
        
        originalPositions[i3] = x;
        originalPositions[i3 + 1] = y;
        originalPositions[i3 + 2] = z;
        
        scales[i] = 14;
      }
      
    } else if (animationType === 'torus') {
      // Torus with Fibonacci distribution
      const baseParticles = 3000;
      const numParticles = Math.floor(baseParticles * fibonacciDensity);
      const majorRadius = 150; // Distance from center to tube center
      const minorRadius = 60;  // Tube radius
      
      actualParticles = Math.min(numParticles, MAX_PARTICLES - 100);
      animationData = { majorRadius, minorRadius, numParticles: actualParticles };
      
      // Generate particles on torus surface using Fibonacci mapping
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      
      for (let i = 0; i < actualParticles; i++) {
        // Map Fibonacci sequence to torus parameters
        const u = (i / actualParticles) * 2 * Math.PI; // Major circumference
        const v = (goldenAngle * i) % (2 * Math.PI);   // Minor circumference
        
        // Torus parametric equations
        const x = (majorRadius + minorRadius * Math.cos(v)) * Math.cos(u);
        const y = minorRadius * Math.sin(v);
        const z = (majorRadius + minorRadius * Math.cos(v)) * Math.sin(u);
        
        const i3 = i * 3;
        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
        
        originalPositions[i3] = x;
        originalPositions[i3 + 1] = y;
        originalPositions[i3 + 2] = z;
        
        scales[i] = 12;
      }
      
    } else if (animationType === 'parametric_spiral_1') {
      // Hypocycloid (spirograph - inner circle rolling inside outer circle)
      const params = spiralParams.spiral1 || {
        R: 120, r: 30, d: 50, rotations: 8
      };
      const basePointsPerRotation = 120; // Increased for much smoother curves
      const pointsPerRotation = Math.floor(basePointsPerRotation * density);
      const totalPoints = params.rotations * pointsPerRotation;
      
      actualParticles = Math.min(totalPoints, MAX_PARTICLES - 100);
      animationData = { params, pointsPerRotation, totalPoints: actualParticles };
      
      for (let i = 0; i < actualParticles; i++) {
        const t = (i / pointsPerRotation) * 2 * Math.PI; // Parameter t
        
        // Hypocycloid equations: x(t) = (R - r) * cos(t) + d * cos(((R - r) / r) * t)
        //                        y(t) = (R - r) * sin(t) - d * sin(((R - r) / r) * t)
        const R = params.R;
        const r = params.r;
        const d = params.d;
        
        const x = (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t);
        const z = (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t);
        const y = 0; // Flat spirograph pattern
        
        const i3 = i * 3;
        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
        
        originalPositions[i3] = x;
        originalPositions[i3 + 1] = y;
        originalPositions[i3 + 2] = z;
        
        scales[i] = 13;
      }
      
    } else if (animationType === 'parametric_spiral_2') {
      // Epicycloid (spirograph - outer circle rolling around inner circle)
      const params = spiralParams.spiral2 || {
        R: 80, r: 25, d: 40, rotations: 6
      };
      const basePointsPerRotation = 150; // Increased for much smoother curves
      const pointsPerRotation = Math.floor(basePointsPerRotation * density);
      const totalPoints = params.rotations * pointsPerRotation;
      
      actualParticles = Math.min(totalPoints, MAX_PARTICLES - 100);
      animationData = { params, pointsPerRotation, totalPoints: actualParticles };
      
      for (let i = 0; i < actualParticles; i++) {
        const t = (i / pointsPerRotation) * 2 * Math.PI; // Parameter t
        
        // Epicycloid equations: x(t) = (R + r) * cos(t) - d * cos(((R + r) / r) * t)
        //                       y(t) = (R + r) * sin(t) - d * sin(((R + r) / r) * t)
        const R = params.R;
        const r = params.r;
        const d = params.d;
        
        const x = (R + r) * Math.cos(t) - d * Math.cos(((R + r) / r) * t);
        const z = (R + r) * Math.sin(t) - d * Math.sin(((R + r) / r) * t);
        const y = 0; // Flat spirograph pattern
        
        const i3 = i * 3;
        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
        
        originalPositions[i3] = x;
        originalPositions[i3 + 1] = y;
        originalPositions[i3 + 2] = z;
        
        scales[i] = 13;
      }
      
    } else if (animationType === 'multi_sphere_25') {
      // Large sphere with multiple 1/25th size spheres inside (atom-like structure)
      const outerRadius = 200;
      const innerRadius = outerRadius / 25;
      const numInnerSpheres = 80; // Increased 10-fold from 8 to 80
      
      const outerSphereParticles = Math.floor(1000 * fibonacciDensity); // Reduced to make room for more inner spheres
      const innerSphereParticles = Math.floor(25 * fibonacciDensity); // Reduced per sphere since we have many more
      const totalInnerParticles = innerSphereParticles * numInnerSpheres;
      
      actualParticles = Math.min(outerSphereParticles + totalInnerParticles, MAX_PARTICLES - 100);
      animationData = { 
        outerRadius, 
        innerRadius, 
        numInnerSpheres,
        outerSphereParticles, 
        innerSphereParticles,
        numParticles: actualParticles 
      };
      
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      let particleIndex = 0;
      
      // Outer sphere particles
      for (let i = 0; i < outerSphereParticles && particleIndex < actualParticles; i++) {
        const y = 1 - (i / (outerSphereParticles - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = goldenAngle * i;
        
        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;
        
        const scaledX = x * outerRadius;
        const scaledY = y * outerRadius;
        const scaledZ = z * outerRadius;
        
        const i3 = particleIndex * 3;
        positions[i3] = scaledX;
        positions[i3 + 1] = scaledY;
        positions[i3 + 2] = scaledZ;
        
        originalPositions[i3] = scaledX;
        originalPositions[i3 + 1] = scaledY;
        originalPositions[i3 + 2] = scaledZ;
        
        scales[particleIndex] = 16;
        particleIndex++;
      }
      
      // Generate atom-like clustered positions for 80 inner spheres
      const innerSpherePositions = [];
      const clusterRadius = 80; // Tighter clustering radius
      
      // Create multiple layers/shells like electron orbitals
      const shells = [
        { count: 1, radius: 0 },      // Nucleus (center)
        { count: 8, radius: 15 },     // First shell - very close
        { count: 18, radius: 30 },    // Second shell
        { count: 32, radius: 50 },    // Third shell
        { count: 21, radius: 70 }     // Fourth shell (remaining spheres)
      ];
      
      for (const shell of shells) {
        for (let i = 0; i < shell.count && innerSpherePositions.length < numInnerSpheres; i++) {
          if (shell.radius === 0) {
            // Center sphere
            innerSpherePositions.push([0, 0, 0]);
          } else {
            // Distribute spheres evenly around the shell using Fibonacci spiral
            const y = 1 - (i / (shell.count - 1)) * 2;
            const radiusAtY = Math.sqrt(1 - y * y);
            const theta = goldenAngle * i;
            
            const x = Math.cos(theta) * radiusAtY * shell.radius;
            const z = Math.sin(theta) * radiusAtY * shell.radius;
            const shellY = y * shell.radius;
            
            innerSpherePositions.push([x, shellY, z]);
          }
        }
      }
      
      for (let sphereIdx = 0; sphereIdx < numInnerSpheres && particleIndex < actualParticles; sphereIdx++) {
        const centerPos = innerSpherePositions[sphereIdx] || [0, 0, 0];
        
        for (let i = 0; i < innerSphereParticles && particleIndex < actualParticles; i++) {
          const y = 1 - (i / (innerSphereParticles - 1)) * 2;
          const radiusAtY = Math.sqrt(1 - y * y);
          const theta = goldenAngle * i * (1 + sphereIdx * 0.05); // Different phase per sphere
          
          const x = Math.cos(theta) * radiusAtY;
          const z = Math.sin(theta) * radiusAtY;
          
          const scaledX = x * innerRadius + centerPos[0];
          const scaledY = y * innerRadius + centerPos[1];
          const scaledZ = z * innerRadius + centerPos[2];
          
          const i3 = particleIndex * 3;
          positions[i3] = scaledX;
          positions[i3 + 1] = scaledY;
          positions[i3 + 2] = scaledZ;
          
          originalPositions[i3] = scaledX;
          originalPositions[i3 + 1] = scaledY;
          originalPositions[i3 + 2] = scaledZ;
          
          scales[particleIndex] = 6; // Even smaller particles for tiny spheres
          particleIndex++;
        }
      }
      
    } else if (animationType === 'multi_sphere_10') {
      // Large sphere with multiple 1/10th size spheres inside (atom-like structure)
      const outerRadius = 200;
      const innerRadius = outerRadius / 10;
      const numInnerSpheres = 24; // Increased 4-fold from 6 to 24
      
      const outerSphereParticles = Math.floor(1100 * fibonacciDensity); // Slightly reduced to make room
      const innerSphereParticles = Math.floor(120 * fibonacciDensity); // Reduced per sphere since we have more
      const totalInnerParticles = innerSphereParticles * numInnerSpheres;
      
      actualParticles = Math.min(outerSphereParticles + totalInnerParticles, MAX_PARTICLES - 100);
      animationData = { 
        outerRadius, 
        innerRadius, 
        numInnerSpheres,
        outerSphereParticles, 
        innerSphereParticles,
        numParticles: actualParticles 
      };
      
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      let particleIndex = 0;
      
      // Outer sphere particles
      for (let i = 0; i < outerSphereParticles && particleIndex < actualParticles; i++) {
        const y = 1 - (i / (outerSphereParticles - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = goldenAngle * i;
        
        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;
        
        const scaledX = x * outerRadius;
        const scaledY = y * outerRadius;
        const scaledZ = z * outerRadius;
        
        const i3 = particleIndex * 3;
        positions[i3] = scaledX;
        positions[i3 + 1] = scaledY;
        positions[i3 + 2] = scaledZ;
        
        originalPositions[i3] = scaledX;
        originalPositions[i3 + 1] = scaledY;
        originalPositions[i3 + 2] = scaledZ;
        
        scales[particleIndex] = 16;
        particleIndex++;
      }
      
      // Generate atom-like clustered positions for 24 inner spheres
      const innerSpherePositions = [];
      
      // Create concentric shells like electron orbitals (tighter clustering)
      const shells = [
        { count: 1, radius: 0 },      // Nucleus (center)
        { count: 6, radius: 25 },     // First shell - very close
        { count: 12, radius: 45 },    // Second shell
        { count: 5, radius: 65 }      // Third shell (remaining spheres)
      ];
      
      for (const shell of shells) {
        for (let i = 0; i < shell.count && innerSpherePositions.length < numInnerSpheres; i++) {
          if (shell.radius === 0) {
            // Center sphere
            innerSpherePositions.push([0, 0, 0]);
          } else {
            // Distribute spheres evenly around the shell using Fibonacci spiral
            const y = 1 - (i / (shell.count - 1)) * 2;
            const radiusAtY = Math.sqrt(1 - y * y);
            const theta = goldenAngle * i;
            
            const x = Math.cos(theta) * radiusAtY * shell.radius;
            const z = Math.sin(theta) * radiusAtY * shell.radius;
            const shellY = y * shell.radius;
            
            innerSpherePositions.push([x, shellY, z]);
          }
        }
      }
      
      for (let sphereIdx = 0; sphereIdx < numInnerSpheres && particleIndex < actualParticles; sphereIdx++) {
        const centerPos = innerSpherePositions[sphereIdx] || [0, 0, 0];
        
        for (let i = 0; i < innerSphereParticles && particleIndex < actualParticles; i++) {
          const y = 1 - (i / (innerSphereParticles - 1)) * 2;
          const radiusAtY = Math.sqrt(1 - y * y);
          const theta = goldenAngle * i * (1 + sphereIdx * 0.1); // Different phase per sphere
          
          const x = Math.cos(theta) * radiusAtY;
          const z = Math.sin(theta) * radiusAtY;
          
          const scaledX = x * innerRadius + centerPos[0];
          const scaledY = y * innerRadius + centerPos[1];
          const scaledZ = z * innerRadius + centerPos[2];
          
          const i3 = particleIndex * 3;
          positions[i3] = scaledX;
          positions[i3 + 1] = scaledY;
          positions[i3 + 2] = scaledZ;
          
          originalPositions[i3] = scaledX;
          originalPositions[i3 + 1] = scaledY;
          originalPositions[i3 + 2] = scaledZ;
          
          scales[particleIndex] = 10; // Medium particles for 1/10th spheres
          particleIndex++;
        }
      }
      
    } else if (animationType === 'torus_5_sided') {
      // 5-sided torus with pentagonal cross-section
      const baseParticles = 3000;
      const numParticles = Math.floor(baseParticles * fibonacciDensity);
      const majorRadius = 150; // Distance from center to tube center
      const minorRadius = 60;  // Tube radius
      const sides = 5; // Pentagon cross-section
      
      actualParticles = Math.min(numParticles, MAX_PARTICLES - 100);
      animationData = { majorRadius, minorRadius, sides, numParticles: actualParticles };
      
      // Generate particles on 5-sided torus surface
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      
      for (let i = 0; i < actualParticles; i++) {
        // Map Fibonacci sequence to torus parameters
        const u = (i / actualParticles) * 2 * Math.PI; // Major circumference
        const vContinuous = (goldenAngle * i) % (2 * Math.PI); // Minor circumference
        
        // Create pentagonal cross-section by quantizing the minor angle
        const pentagonAngle = (2 * Math.PI) / sides;
        const sideIndex = Math.floor(vContinuous / pentagonAngle);
        const sideProgress = (vContinuous % pentagonAngle) / pentagonAngle;
        
        // Calculate pentagon vertices
        const angle1 = sideIndex * pentagonAngle;
        const angle2 = ((sideIndex + 1) % sides) * pentagonAngle;
        
        // Pentagon vertex positions
        const vertex1 = {
          x: minorRadius * Math.cos(angle1),
          y: minorRadius * Math.sin(angle1)
        };
        const vertex2 = {
          x: minorRadius * Math.cos(angle2),
          y: minorRadius * Math.sin(angle2)
        };
        
        // Interpolate along the pentagon edge
        const localX = vertex1.x + (vertex2.x - vertex1.x) * sideProgress;
        const localY = vertex1.y + (vertex2.y - vertex1.y) * sideProgress;
        
        // Apply torus transformation
        const x = (majorRadius + localX) * Math.cos(u);
        const y = localY;
        const z = (majorRadius + localX) * Math.sin(u);
        
        const i3 = i * 3;
        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
        
        originalPositions[i3] = x;
        originalPositions[i3 + 1] = y;
        originalPositions[i3 + 2] = z;
        
        scales[i] = 12;
      }
      
    } else if (animationType === 'lines_sphere') {
      // AlteredQualia classic lines sphere - multiple rotating spheres with radiating line segments
      const baseRadius = 200; // Base sphere radius
      const numLineSegments = Math.floor(1500 * density); // Number of line pairs
      
      // AlteredQualia original parameters: [scale, color, opacity, linewidth]
      const sphereParameters = [
        [0.25, 0xff7700, 1.0, 2],    // Smallest orange sphere
        [0.5, 0xff9900, 1.0, 1],     // Small orange sphere  
        [0.75, 0xffaa00, 0.75, 1],   // Medium yellow sphere
        [1.0, 0xffaa00, 0.5, 1],     // Large yellow sphere
        [1.25, 0x000833, 0.8, 1],    // Dark blue sphere
        [3.0, 0xaaaaaa, 0.75, 2],    // Large gray sphere
        [3.5, 0xffffff, 0.5, 1],     // Larger white sphere
        [4.5, 0xffffff, 0.25, 1],    // Very large white sphere
        [5.5, 0xffffff, 0.125, 1]    // Largest white sphere
      ];
      
      const numSpheres = sphereParameters.length;
      const particlesPerSphere = numLineSegments * 2; // Each line segment = 2 particles
      actualParticles = Math.min(numSpheres * particlesPerSphere, MAX_PARTICLES - 100);
      
      animationData = { 
        baseRadius, 
        numLineSegments, 
        numSpheres, 
        sphereParameters,
        particlesPerSphere,
        numParticles: actualParticles 
      };
      
      let particleIndex = 0;
      
      // Generate line segments for each sphere
      for (let sphereIdx = 0; sphereIdx < numSpheres && particleIndex < actualParticles; sphereIdx++) {
        const params = sphereParameters[sphereIdx];
        const sphereScale = params[0];
        const sphereRadius = baseRadius * sphereScale;
        
        // Generate radiating line segments
        for (let i = 0; i < numLineSegments && particleIndex < actualParticles - 1; i++) {
          // Generate random point on sphere surface
          const vector1 = new THREE.Vector3(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1, 
            Math.random() * 2 - 1
          );
          vector1.normalize();
          vector1.multiplyScalar(sphereRadius);
          
          // Create second point further out (line extension controlled by lineLength)
          const vector2 = vector1.clone();
          const extensionFactor = (Math.random() * 0.09 + 1) * lineLength; // Line length parameter
          vector2.multiplyScalar(extensionFactor);
          
          // Store first point of line segment
          const i3_1 = particleIndex * 3;
          positions[i3_1] = vector1.x;
          positions[i3_1 + 1] = vector1.y;
          positions[i3_1 + 2] = vector1.z;
          
          originalPositions[i3_1] = vector1.x;
          originalPositions[i3_1 + 1] = vector1.y;
          originalPositions[i3_1 + 2] = vector1.z;
          
          // Store sphere index in scale for animation reference
          scales[particleIndex] = sphereIdx + 1; // 1-based index
          particleIndex++;
          
          // Store second point of line segment
          const i3_2 = particleIndex * 3;
          positions[i3_2] = vector2.x;
          positions[i3_2 + 1] = vector2.y;
          positions[i3_2 + 2] = vector2.z;
          
          originalPositions[i3_2] = vector2.x;
          originalPositions[i3_2 + 1] = vector2.y;
          originalPositions[i3_2 + 2] = vector2.z;
          
          scales[particleIndex] = sphereIdx + 1; // 1-based index
          particleIndex++;
        }
      }
    }
    
    // Fill remaining positions with invisible particles (scale = 0)
    for (let i = actualParticles; i < MAX_PARTICLES; i++) {
      const i3 = i * 3;
      positions[i3] = 0;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = 0;
      
      originalPositions[i3] = 0;
      originalPositions[i3 + 1] = 0;
      originalPositions[i3 + 2] = 0;
      
      scales[i] = 0; // Make invisible
    }
    
    return { 
      positions, 
      scales, 
      originalPositions, 
      numParticles: MAX_PARTICLES, // Always use max for buffer consistency
      actualParticles, // Track actual visible particles
      animationData
    };
  }, [animationType, fibonacciDensity, density, spiralParams]);

  // Line material for lines_sphere demo
  const lineMaterial = useMemo(() => {
    // Base orange-yellow color similar to particle material
    const baseHue = 0.1; // Orange-yellow
    const baseSaturation = 0.8;
    const baseBrightness = 0.7;
    
    // Apply color transitions
    const finalHue = (baseHue + colorTransition1) % 1.0;
    const finalSaturation = baseSaturation * colorTransition2;
    const finalBrightness = baseBrightness * colorTransition3;
    
    return new THREE.LineBasicMaterial({
      color: new THREE.Color().setHSL(finalHue, finalSaturation, finalBrightness),
      transparent: true,
      opacity: 0.8,
      linewidth: 2
    });
  }, [colorTransition1, colorTransition2, colorTransition3]);

  // Custom shader material
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
    if (!pointsRef.current || particles.actualParticles === 0) {
      return;
    }
    
    const positions = pointsRef.current.geometry.attributes.position.array;
    const scales = pointsRef.current.geometry.attributes.scale?.array;
    const { actualParticles, originalPositions, animationData } = particles;
    
    // Always update time for continuous undulation, even when paused
    slowTime.current += delta * 1.2;
    
    // Update shader uniforms
    if (pointsRef.current && pointsRef.current.material.uniforms) {
      pointsRef.current.material.uniforms.uTime.value = slowTime.current;
      pointsRef.current.material.uniforms.uHueShift.value = colorTransition1;
      pointsRef.current.material.uniforms.uSaturation.value = colorTransition2;
      pointsRef.current.material.uniforms.uBrightness.value = colorTransition3;
    }
    
    if (animationType === 'puncture') {
      const { AMOUNTX, AMOUNTY } = animationData;
      let i = 0, j = 0;
      
      // Undulation factor: 0 = no movement, 10 = full undulation
      const undulationFactor = undulationSpeed / 10.0;
      
      // Center of the grid for pitted effect
      const centerX = (AMOUNTX - 1) / 2;
      const centerY = (AMOUNTY - 1) / 2;
      
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const origX = originalPositions[i];
          const origY = originalPositions[i + 1];
          const origZ = originalPositions[i + 2];
          
          scales[j] = 18;
          
          // Distance from center for pitted effect
          const distFromCenter = Math.sqrt(
            Math.pow(ix - centerX, 2) + Math.pow(iy - centerY, 2)
          );
          
          positions[i] = origX;
          positions[i + 2] = origZ;
          
          if (undulationFactor === 0) {
            // No undulation - keep original flat positions
            positions[i + 1] = origY;
          } else {
            // Gentle undulation for the surface
            const surfaceUndulation = Math.sin(slowTime.current * 0.5 * undulationSpeed + ix * 0.1 + iy * 0.1) * 8 * undulationFactor;
            
            if (isActive) {
              // Pitted effect - downward pointed bulge at center
              const punctureRadius = 8; // Radius of pitted effect
              const punctureDepth = 80; // Maximum depth of pit
              
              if (distFromCenter < punctureRadius) {
                // Create a sharp downward bulge
                const punctureFactor = Math.cos((distFromCenter / punctureRadius) * Math.PI * 0.5);
                const punctureWave = Math.sin(count.current * 0.1) * 0.5 + 0.5; // Pulsing pit
                positions[i + 1] = origY + surfaceUndulation - (punctureFactor * punctureDepth * punctureWave * undulationFactor);
              } else {
                // Surface ripples spreading from pit
                const rippleDelay = (distFromCenter - punctureRadius) * 0.3;
                const ripple = Math.sin(count.current * 0.2 - rippleDelay) * 
                             Math.exp(-(distFromCenter - punctureRadius) * 0.1) * 15 * undulationFactor;
                positions[i + 1] = origY + surfaceUndulation + ripple;
              }
            } else {
              positions[i + 1] = origY + surfaceUndulation;
            }
          }
          
          i += 3;
          j++;
        }
      }
      
      // Increment wave counter for animation only if there's undulation
      if (isActive && undulationFactor > 0) {
        count.current += 0.08 * undulationFactor;
      }
      
    } else if (animationType === 'wave') {
      const { AMOUNTX, AMOUNTY } = animationData;
      let i = 0, j = 0;
      
      // Undulation factor: 0 = no movement, 10 = full undulation
      const undulationFactor = undulationSpeed / 10.0;
      
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const origX = originalPositions[i];
          const origY = originalPositions[i + 1];
          const origZ = originalPositions[i + 2];
          
          scales[j] = 20;
          
          if (undulationFactor === 0) {
            // No undulation - keep original positions
            positions[i] = origX;
            positions[i + 1] = origY;
            positions[i + 2] = origZ;
          } else {
            // Reduced undulation for flexibility - more subtle movement
            const slowUndulationX = Math.sin(slowTime.current * 0.6 * undulationSpeed + ix * 0.2) * 15 * undulationFactor; // Reduced from 25 to 15
            const slowUndulationZ = Math.cos(slowTime.current * 0.8 * undulationSpeed + iy * 0.2) * 15 * undulationFactor; // Reduced from 25 to 15
            const slowUndulationY = Math.sin(slowTime.current * 0.4 * undulationSpeed + ix * 0.1 + iy * 0.1) * 25 * undulationFactor; // Reduced from 40 to 25
            
            const secondaryWaveX = Math.cos(slowTime.current * 1.1 * undulationSpeed + iy * 0.15) * 10 * undulationFactor; // Reduced from 15 to 10
            const secondaryWaveZ = Math.sin(slowTime.current * 0.9 * undulationSpeed + ix * 0.15) * 10 * undulationFactor; // Reduced from 15 to 10
            const secondaryWaveY = Math.cos(slowTime.current * 0.7 * undulationSpeed + (ix + iy) * 0.08) * 12 * undulationFactor; // Reduced from 20 to 12
            
            positions[i] = origX + slowUndulationX + secondaryWaveX;
            positions[i + 2] = origZ + slowUndulationZ + secondaryWaveZ;
            
                          if (isActive) {
                positions[i + 1] = origY + slowUndulationY + secondaryWaveY +
                                  (Math.sin((ix + count.current) * 0.3) * 30 * undulationFactor) + // Reduced from 50 to 30
                                  (Math.sin((iy + count.current) * 0.5) * 30 * undulationFactor); // Reduced from 50 to 30
              } else {
                positions[i + 1] = origY + slowUndulationY + secondaryWaveY;
              }
          }
          
          i += 3;
          j++;
        }
      }
      
      // Increment wave counter for animation only if there's undulation
      if (isActive && undulationFactor > 0) {
        count.current += 0.15 * undulationFactor;
      }
      
    } else if (animationType === 'stretch') {
      const { AMOUNTX, AMOUNTY } = animationData;
      let i = 0, j = 0;
      
      // Undulation factor: 0 = no movement, 10 = full undulation
      const undulationFactor = undulationSpeed / 10.0;
      
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const origX = originalPositions[i];
          const origY = originalPositions[i + 1];
          const origZ = originalPositions[i + 2];
          
          scales[j] = 18;
          
          if (undulationFactor === 0) {
            // No undulation - keep original positions
            positions[i] = origX;
            positions[i + 1] = origY;
            positions[i + 2] = origZ;
          } else {
            const stretchFactor = isActive ? 
              1 + Math.sin(state.clock.elapsedTime * 1.5 * undulationSpeed) * 0.8 * undulationFactor : 
              1 + Math.sin(slowTime.current * 0.3 * undulationSpeed) * 0.2 * undulationFactor;
            
            positions[i] = origX * stretchFactor;
            positions[i + 1] = origY;
            positions[i + 2] = origZ / stretchFactor;
          }
          
          i += 3;
          j++;
        }
      }
      
    } else if (animationType === 'cube') {
      // Cube with gentle undulation affected by speed
      const time = slowTime.current * undulationSpeed;
      
      for (let i = 0; i < actualParticles; i++) {
        const i3 = i * 3;
        const origX = originalPositions[i3];
        const origY = originalPositions[i3 + 1];
        const origZ = originalPositions[i3 + 2];
        
        // Gentle undulation for cube faces
        const faceUndulation = Math.sin(time * 0.5 + origX * 0.01 + origY * 0.01) * 5;
        const secondaryUndulation = Math.cos(time * 0.7 + origZ * 0.01) * 3;
        
        // Apply subtle movement while maintaining cube shape
        positions[i3] = origX + faceUndulation;
        positions[i3 + 1] = origY + secondaryUndulation;
        positions[i3 + 2] = origZ + Math.sin(time * 0.6 + origX * 0.01) * 4;
        
        // Vary scale slightly with undulation
        scales[i] = 15 * (1 + Math.sin(time * 0.4 + i * 0.1) * 0.1);
      }
      
    } else if (animationType === 'icosahedron') {
      // Icosahedron global shape undulation animation
      const time = slowTime.current * undulationSpeed;
      
      // Global undulation patterns that affect the entire shape
      const globalWave1 = Math.sin(time * 0.7) * 0.15;
      const globalWave2 = Math.cos(time * 1.1) * 0.12;
      const globalWave3 = Math.sin(time * 1.8) * 0.08;
      
      // Smooth easing function for bezier-like motion
      const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const globalSmooth = easeInOutCubic((Math.sin(time * 0.4) + 1) / 2);
      
      // Active state adds more dramatic global undulation
      const activeGlobalUndulation = isActive ? 
        Math.sin(time * 1.3) * 0.25 * globalSmooth : 0;
      
      // Process all particles with global undulation
      for (let i = 0; i < actualParticles; i++) {
        const i3 = i * 3;
        
        // Get original position
        const origX = originalPositions[i3];
        const origY = originalPositions[i3 + 1];
        const origZ = originalPositions[i3 + 2];
        
        // Calculate distance from center of entire icosahedron
        const distFromCenter = Math.sqrt(origX * origX + origY * origY + origZ * origZ);
        
        // Normalize position to get radial direction
        const normalizedX = origX / distFromCenter;
        const normalizedY = origY / distFromCenter;
        const normalizedZ = origZ / distFromCenter;
        
        // Create spatial variation based on position
        const spatialPhaseX = origX * 0.01;
        const spatialPhaseY = origY * 0.01;
        const spatialPhaseZ = origZ * 0.01;
        
        // Global undulation with spatial variation
        const spatialWave1 = Math.sin(time * 0.9 + spatialPhaseX + spatialPhaseY) * 0.1;
        const spatialWave2 = Math.cos(time * 1.4 + spatialPhaseZ + spatialPhaseX) * 0.08;
        const spatialWave3 = Math.sin(time * 2.2 + spatialPhaseY + spatialPhaseZ) * 0.06;
        
        // Combine global and spatial undulations
        const totalUndulation = (globalWave1 + globalWave2 + globalWave3 + 
                               spatialWave1 + spatialWave2 + spatialWave3 + 
                               activeGlobalUndulation) * globalSmooth;
        
        // Apply undulation radially from center (breathing effect)
        const radialUndulation = totalUndulation * 20;
        
        // Add some directional waves across the entire shape
        const directionalWaveX = Math.sin(time * 0.8 + origY * 0.02) * 8;
        const directionalWaveY = Math.cos(time * 1.2 + origZ * 0.02) * 8;
        const directionalWaveZ = Math.sin(time * 1.6 + origX * 0.02) * 8;
        
        // Apply combined undulations
        positions[i3] = origX + normalizedX * radialUndulation + directionalWaveX;
        positions[i3 + 1] = origY + normalizedY * radialUndulation + directionalWaveY;
        positions[i3 + 2] = origZ + normalizedZ * radialUndulation + directionalWaveZ;
        
        // Global particle scale variation
        scales[i] = 8 * (1 + Math.abs(totalUndulation) * 0.4 + globalSmooth * 0.3);
      }
      
    } else if (animationType === 'oblate') {
      // Oblate spheroid with organic amoeba-like ripples
      const time = slowTime.current * undulationSpeed;
      
      for (let i = 0; i < actualParticles; i++) {
        const i3 = i * 3;
        const origX = originalPositions[i3];
        const origY = originalPositions[i3 + 1];
        const origZ = originalPositions[i3 + 2];
        
        // Calculate spherical coordinates for organic ripples
        const distance = Math.sqrt(origX * origX + origY * origY + origZ * origZ);
        const phi = Math.acos(origY / distance);
        const theta = Math.atan2(origZ, origX);
        
        // Create multiple organic ripple layers
        const ripple1 = Math.sin(time * 0.8 + phi * 4 + theta * 3) * 0.15;
        const ripple2 = Math.cos(time * 1.2 + phi * 6 + theta * 2) * 0.12;
        const ripple3 = Math.sin(time * 1.6 + phi * 3 + theta * 5) * 0.08;
        const ripple4 = Math.cos(time * 2.1 + phi * 2 + theta * 4) * 0.06;
        
        // Amoeba-like propulsion waves
        const propulsion1 = Math.sin(time * 0.7 + origX * 0.02 + origZ * 0.02) * 0.2;
        const propulsion2 = Math.cos(time * 1.1 + origY * 0.03 + origX * 0.015) * 0.15;
        const propulsion3 = Math.sin(time * 1.4 + origZ * 0.025 + origY * 0.02) * 0.1;
        
        // Organic breathing effect
        const breathing = Math.sin(time * 0.5) * 0.1 + 1;
        
        // Active state adds more dramatic organic movement
        const activeRipple = isActive ? 
          Math.sin(time * 2.5 + phi * 8 + theta * 6) * 0.25 : 0;
        
        // Combine all organic effects
        const totalRipple = ripple1 + ripple2 + ripple3 + ripple4 + 
                           propulsion1 + propulsion2 + propulsion3 + activeRipple;
        
        // Apply organic deformation while maintaining oblate shape
        const deformationFactor = 1 + totalRipple * breathing;
        
        // Add some directional flow for amoeba-like movement
        const flowX = Math.sin(time * 0.6 + origY * 0.01) * 8;
        const flowY = Math.cos(time * 0.8 + origZ * 0.01) * 6;
        const flowZ = Math.sin(time * 1.0 + origX * 0.01) * 8;
        
        positions[i3] = origX * deformationFactor + flowX;
        positions[i3 + 1] = origY * deformationFactor + flowY;
        positions[i3 + 2] = origZ * deformationFactor + flowZ;
        
        // Organic scale variation
        scales[i] = 12 * (1 + Math.abs(totalRipple) * 0.5 + breathing * 0.2);
      }
      
    } else if (animationType === 'fibonacci_sphere') {
      // Fibonacci sphere with parametric undulation (0-10 speed range)
      const time = slowTime.current;
      
      // Undulation factor: 0 = no movement, 10 = full undulation
      const undulationFactor = undulationSpeed / 10.0;
      
      for (let i = 0; i < actualParticles; i++) {
        const i3 = i * 3;
        const origX = originalPositions[i3];
        const origY = originalPositions[i3 + 1];
        const origZ = originalPositions[i3 + 2];
        
        if (undulationFactor === 0) {
          // No undulation - keep original positions
          positions[i3] = origX;
          positions[i3 + 1] = origY;
          positions[i3 + 2] = origZ;
          scales[i] = 15;
        } else {
          // Calculate spherical coordinates for undulation
          const distance = Math.sqrt(origX * origX + origY * origY + origZ * origZ);
          const phi = Math.acos(origY / distance);
          const theta = Math.atan2(origZ, origX);
          
          // Multiple undulation layers with Fibonacci-based frequencies
          const wave1 = Math.sin(time * 0.8 * undulationFactor + phi * 5 + theta * 3) * 0.1;
          const wave2 = Math.cos(time * 1.3 * undulationFactor + phi * 8 + theta * 2) * 0.08;
          const wave3 = Math.sin(time * 2.1 * undulationFactor + phi * 3 + theta * 8) * 0.06;
          
          // Golden ratio based undulation
          const goldenWave = Math.sin(time * 1.618 * undulationFactor + i * 0.1) * 0.12;
          
          // Active state enhancement
          const activeWave = isActive ? 
            Math.sin(time * 3.0 * undulationFactor + phi * 13 + theta * 5) * 0.15 : 0;
          
          // Combine all waves
          const totalWave = (wave1 + wave2 + wave3 + goldenWave + activeWave) * undulationFactor;
          
          // Apply radial undulation
          const radialUndulation = totalWave * 25;
          const normalizedX = origX / distance;
          const normalizedY = origY / distance;
          const normalizedZ = origZ / distance;
          
          positions[i3] = origX + normalizedX * radialUndulation;
          positions[i3 + 1] = origY + normalizedY * radialUndulation;
          positions[i3 + 2] = origZ + normalizedZ * radialUndulation;
          
          // Scale variation based on undulation
          scales[i] = 15 * (1 + Math.abs(totalWave) * 0.4 * undulationFactor);
        }
      }
      
    } else if (animationType === 'multi_sphere_25') {
      // Multi-sphere animation with 1/25th size inner spheres
      const { outerRadius, innerRadius, numInnerSpheres, outerSphereParticles, innerSphereParticles } = animationData;
      const time = slowTime.current;
      
      // Undulation factor: 0 = no movement, 10 = full undulation
      const undulationFactor = undulationSpeed / 10.0;
      
      let particleIndex = 0;
      
      // Animate outer sphere particles
      for (let i = 0; i < outerSphereParticles && particleIndex < actualParticles; i++) {
        const i3 = particleIndex * 3;
        const origX = originalPositions[i3];
        const origY = originalPositions[i3 + 1];
        const origZ = originalPositions[i3 + 2];
        
        if (undulationFactor === 0) {
          // No undulation - keep original positions
          positions[i3] = origX;
          positions[i3 + 1] = origY;
          positions[i3 + 2] = origZ;
          scales[particleIndex] = 16;
        } else {
          // Calculate spherical coordinates for undulation
          const distance = Math.sqrt(origX * origX + origY * origY + origZ * origZ);
          const phi = Math.acos(origY / distance);
          const theta = Math.atan2(origZ, origX);
          
          // Outer sphere undulation
          const wave1 = Math.sin(time * 0.6 * undulationFactor + phi * 4 + theta * 2) * 0.08;
          const wave2 = Math.cos(time * 1.0 * undulationFactor + phi * 6 + theta * 3) * 0.06;
          const wave3 = Math.sin(time * 1.8 * undulationFactor + phi * 2 + theta * 5) * 0.04;
          
          const totalWave = (wave1 + wave2 + wave3) * undulationFactor;
          const radialUndulation = totalWave * 20;
          
          const normalizedX = origX / distance;
          const normalizedY = origY / distance;
          const normalizedZ = origZ / distance;
          
          positions[i3] = origX + normalizedX * radialUndulation;
          positions[i3 + 1] = origY + normalizedY * radialUndulation;
          positions[i3 + 2] = origZ + normalizedZ * radialUndulation;
          
          scales[particleIndex] = 16 * (1 + Math.abs(totalWave) * 0.3 * undulationFactor);
        }
        particleIndex++;
      }
      
      // Animate inner sphere particles (80 spheres in atom-like shells)
      const shells = [
        { count: 1, radius: 0 },      // Nucleus (center)
        { count: 8, radius: 15 },     // First shell - very close
        { count: 18, radius: 30 },    // Second shell
        { count: 32, radius: 50 },    // Third shell
        { count: 21, radius: 70 }     // Fourth shell (remaining spheres)
      ];
      
      const innerSpherePositions = [];
      const goldenAngleAnim = Math.PI * (3 - Math.sqrt(5));
      
      for (const shell of shells) {
        for (let i = 0; i < shell.count && innerSpherePositions.length < 80; i++) {
          if (shell.radius === 0) {
            innerSpherePositions.push([0, 0, 0]);
          } else {
            const y = 1 - (i / (shell.count - 1)) * 2;
            const radiusAtY = Math.sqrt(1 - y * y);
            const theta = goldenAngleAnim * i;
            
            const x = Math.cos(theta) * radiusAtY * shell.radius;
            const z = Math.sin(theta) * radiusAtY * shell.radius;
            const shellY = y * shell.radius;
            
            innerSpherePositions.push([x, shellY, z]);
          }
        }
      }
      
      for (let sphereIdx = 0; sphereIdx < numInnerSpheres && particleIndex < actualParticles; sphereIdx++) {
        const centerPos = innerSpherePositions[sphereIdx] || [0, 0, 0];
        
        for (let i = 0; i < innerSphereParticles && particleIndex < actualParticles; i++) {
          const i3 = particleIndex * 3;
          const origX = originalPositions[i3];
          const origY = originalPositions[i3 + 1];
          const origZ = originalPositions[i3 + 2];
          
          if (undulationFactor === 0) {
            // No undulation - keep original positions
            positions[i3] = origX;
            positions[i3 + 1] = origY;
            positions[i3 + 2] = origZ;
            scales[particleIndex] = 8;
          } else {
            // Calculate position relative to inner sphere center
            const relativeX = origX - centerPos[0];
            const relativeY = origY - centerPos[1];
            const relativeZ = origZ - centerPos[2];
            const distance = Math.sqrt(relativeX * relativeX + relativeY * relativeY + relativeZ * relativeZ);
            
            if (distance > 0) {
              const phi = Math.acos(relativeY / distance);
              const theta = Math.atan2(relativeZ, relativeX);
              
              // Inner sphere undulation with different frequency per sphere
              const spherePhase = sphereIdx * 0.5;
              const wave1 = Math.sin(time * 1.2 * undulationFactor + phi * 3 + theta * 4 + spherePhase) * 0.1;
              const wave2 = Math.cos(time * 1.8 * undulationFactor + phi * 5 + theta * 2 + spherePhase) * 0.08;
              
              const totalWave = (wave1 + wave2) * undulationFactor;
              const radialUndulation = totalWave * 8;
              
              const normalizedX = relativeX / distance;
              const normalizedY = relativeY / distance;
              const normalizedZ = relativeZ / distance;
              
              positions[i3] = origX + normalizedX * radialUndulation;
              positions[i3 + 1] = origY + normalizedY * radialUndulation;
              positions[i3 + 2] = origZ + normalizedZ * radialUndulation;
              
              scales[particleIndex] = 8 * (1 + Math.abs(totalWave) * 0.4 * undulationFactor);
            } else {
              positions[i3] = origX;
              positions[i3 + 1] = origY;
              positions[i3 + 2] = origZ;
              scales[particleIndex] = 8;
            }
          }
          particleIndex++;
        }
      }
      
    } else if (animationType === 'multi_sphere_10') {
      // Multi-sphere animation with 1/10th size inner spheres
      const { outerRadius, innerRadius, numInnerSpheres, outerSphereParticles, innerSphereParticles } = animationData;
      const time = slowTime.current;
      
      // Undulation factor: 0 = no movement, 10 = full undulation
      const undulationFactor = undulationSpeed / 10.0;
      
      let particleIndex = 0;
      
      // Animate outer sphere particles
      for (let i = 0; i < outerSphereParticles && particleIndex < actualParticles; i++) {
        const i3 = particleIndex * 3;
        const origX = originalPositions[i3];
        const origY = originalPositions[i3 + 1];
        const origZ = originalPositions[i3 + 2];
        
        if (undulationFactor === 0) {
          // No undulation - keep original positions
          positions[i3] = origX;
          positions[i3 + 1] = origY;
          positions[i3 + 2] = origZ;
          scales[particleIndex] = 16;
        } else {
          // Calculate spherical coordinates for undulation
          const distance = Math.sqrt(origX * origX + origY * origY + origZ * origZ);
          const phi = Math.acos(origY / distance);
          const theta = Math.atan2(origZ, origX);
          
          // Outer sphere undulation
          const wave1 = Math.sin(time * 0.7 * undulationFactor + phi * 3 + theta * 2) * 0.09;
          const wave2 = Math.cos(time * 1.1 * undulationFactor + phi * 5 + theta * 4) * 0.07;
          const wave3 = Math.sin(time * 1.6 * undulationFactor + phi * 2 + theta * 6) * 0.05;
          
          const totalWave = (wave1 + wave2 + wave3) * undulationFactor;
          const radialUndulation = totalWave * 22;
          
          const normalizedX = origX / distance;
          const normalizedY = origY / distance;
          const normalizedZ = origZ / distance;
          
          positions[i3] = origX + normalizedX * radialUndulation;
          positions[i3 + 1] = origY + normalizedY * radialUndulation;
          positions[i3 + 2] = origZ + normalizedZ * radialUndulation;
          
          scales[particleIndex] = 16 * (1 + Math.abs(totalWave) * 0.3 * undulationFactor);
        }
        particleIndex++;
      }
      
      // Animate inner sphere particles (24 spheres in atom-like shells)
      const shells10x = [
        { count: 1, radius: 0 },      // Nucleus (center)
        { count: 6, radius: 25 },     // First shell - very close
        { count: 12, radius: 45 },    // Second shell
        { count: 5, radius: 65 }      // Third shell (remaining spheres)
      ];
      
      const innerSpherePositions = [];
      const goldenAngleAnim10x = Math.PI * (3 - Math.sqrt(5));
      
      for (const shell of shells10x) {
        for (let i = 0; i < shell.count && innerSpherePositions.length < 24; i++) {
          if (shell.radius === 0) {
            innerSpherePositions.push([0, 0, 0]);
          } else {
            const y = 1 - (i / (shell.count - 1)) * 2;
            const radiusAtY = Math.sqrt(1 - y * y);
            const theta = goldenAngleAnim10x * i;
            
            const x = Math.cos(theta) * radiusAtY * shell.radius;
            const z = Math.sin(theta) * radiusAtY * shell.radius;
            const shellY = y * shell.radius;
            
            innerSpherePositions.push([x, shellY, z]);
          }
        }
      }
      
      for (let sphereIdx = 0; sphereIdx < numInnerSpheres && particleIndex < actualParticles; sphereIdx++) {
        const centerPos = innerSpherePositions[sphereIdx] || [0, 0, 0];
        
        for (let i = 0; i < innerSphereParticles && particleIndex < actualParticles; i++) {
          const i3 = particleIndex * 3;
          const origX = originalPositions[i3];
          const origY = originalPositions[i3 + 1];
          const origZ = originalPositions[i3 + 2];
          
          if (undulationFactor === 0) {
            // No undulation - keep original positions
            positions[i3] = origX;
            positions[i3 + 1] = origY;
            positions[i3 + 2] = origZ;
            scales[particleIndex] = 12;
          } else {
            // Calculate position relative to inner sphere center
            const relativeX = origX - centerPos[0];
            const relativeY = origY - centerPos[1];
            const relativeZ = origZ - centerPos[2];
            const distance = Math.sqrt(relativeX * relativeX + relativeY * relativeY + relativeZ * relativeZ);
            
            if (distance > 0) {
              const phi = Math.acos(relativeY / distance);
              const theta = Math.atan2(relativeZ, relativeX);
              
              // Inner sphere undulation with different frequency per sphere
              const spherePhase = sphereIdx * 0.3;
              const wave1 = Math.sin(time * 1.0 * undulationFactor + phi * 4 + theta * 3 + spherePhase) * 0.12;
              const wave2 = Math.cos(time * 1.5 * undulationFactor + phi * 6 + theta * 2 + spherePhase) * 0.10;
              
              const totalWave = (wave1 + wave2) * undulationFactor;
              const radialUndulation = totalWave * 12;
              
              const normalizedX = relativeX / distance;
              const normalizedY = relativeY / distance;
              const normalizedZ = relativeZ / distance;
              
              positions[i3] = origX + normalizedX * radialUndulation;
              positions[i3 + 1] = origY + normalizedY * radialUndulation;
              positions[i3 + 2] = origZ + normalizedZ * radialUndulation;
              
              scales[particleIndex] = 12 * (1 + Math.abs(totalWave) * 0.4 * undulationFactor);
            } else {
              positions[i3] = origX;
              positions[i3 + 1] = origY;
              positions[i3 + 2] = origZ;
              scales[particleIndex] = 12;
            }
          }
          particleIndex++;
        }
      }
      
    } else if (animationType === 'fibonacci_disc') {
      // Fibonacci disc with parametric undulation (0-10 speed range)
      const time = slowTime.current;
      
      // Undulation factor: 0 = no movement, 10 = full undulation
      const undulationFactor = undulationSpeed / 10.0;
      
      for (let i = 0; i < actualParticles; i++) {
        const i3 = i * 3;
        const origX = originalPositions[i3];
        const origY = originalPositions[i3 + 1];
        const origZ = originalPositions[i3 + 2];
        
        if (undulationFactor === 0) {
          // No undulation - keep original positions
          positions[i3] = origX;
          positions[i3 + 1] = origY;
          positions[i3 + 2] = origZ;
          scales[i] = 16;
        } else {
          // Calculate polar coordinates for disc undulation
          const r = Math.sqrt(origX * origX + origZ * origZ);
          const theta = Math.atan2(origZ, origX);
          
          // Fibonacci spiral based undulation
          const spiralWave1 = Math.sin(time * 1.0 * undulationFactor + r * 0.05 + theta * 3) * 0.3;
          const spiralWave2 = Math.cos(time * 1.618 * undulationFactor + r * 0.08 + theta * 5) * 0.25;
          const spiralWave3 = Math.sin(time * 2.618 * undulationFactor + r * 0.03 + theta * 8) * 0.2;
          
          // Radial waves from center
          const radialWave = Math.sin(time * 0.7 * undulationFactor + r * 0.1) * 0.4;
          
          // Angular waves around disc
          const angularWave = Math.cos(time * 1.4 * undulationFactor + theta * 6) * 0.15;
          
          // Active state enhancement
          const activeWave = isActive ? 
            Math.sin(time * 4.0 * undulationFactor + r * 0.12 + theta * 10) * 0.5 : 0;
          
          // Combine all waves for Y displacement
          const totalWaveY = (spiralWave1 + spiralWave2 + spiralWave3 + radialWave + angularWave + activeWave) * undulationFactor;
          
          // Slight radial undulation for organic feel
          const radialUndulation = Math.sin(time * 0.9 * undulationFactor + theta * 4) * 0.1 * undulationFactor;
          
          positions[i3] = origX * (1 + radialUndulation);
          positions[i3 + 1] = totalWaveY * 30; // Vertical displacement
          positions[i3 + 2] = origZ * (1 + radialUndulation);
          
          // Scale variation based on undulation and distance from center
          const distanceFromCenter = r / 200; // Normalize distance
          scales[i] = 16 * (1 + Math.abs(totalWaveY) * 0.3 * undulationFactor + distanceFromCenter * 0.2);
        }
      }
      
    } else if (animationType === 'biconvex_disc') {
      // Biconvex disc with undulation (outward curves)
      const { maxRadius, convexity } = animationData;
      const time = slowTime.current * undulationSpeed;
      
      for (let i = 0; i < actualParticles; i++) {
        const i3 = i * 3;
        const origX = originalPositions[i3];
        const origY = originalPositions[i3 + 1];
        const origZ = originalPositions[i3 + 2];
        
        const r = Math.sqrt(origX * origX + origZ * origZ);
        const theta = Math.atan2(origZ, origX);
        
        // Reduced undulation effects for biconvex disc
        const radialWave = Math.sin(time * 0.8 + r * 0.02) * 0.08; // Reduced from 0.15 to 0.08
        const angularWave = Math.cos(time * 1.2 + theta * 4) * 0.05; // Reduced from 0.1 to 0.05
        const heightWave = Math.sin(time * 0.6 + r * 0.03 + theta * 2) * 0.1; // Reduced from 0.2 to 0.1
        
        // Active enhancement - also reduced
        const activeWave = isActive ? 
          Math.sin(time * 2.0 + r * 0.05 + theta * 6) * 0.15 : 0; // Reduced from 0.3 to 0.15
        
        const totalWave = radialWave + angularWave + heightWave + activeWave;
        
        // Apply undulation while maintaining biconvex shape (outward curves)
        const normalizedR = r / maxRadius;
        const baseConvexity = convexity * (1 - normalizedR * normalizedR) * maxRadius;
        const undulatedHeight = baseConvexity * (1 + totalWave);
        
        positions[i3] = origX * (1 + radialWave * 0.5);
        positions[i3 + 1] = (origY > 0 ? 1 : -1) * undulatedHeight;
        positions[i3 + 2] = origZ * (1 + radialWave * 0.5);
        
        scales[i] = 14 * (1 + Math.abs(totalWave) * 0.4);
      }
      
    } else if (animationType === 'biconcave_disc') {
      // True biconcave disc with undulation using Evans & Fung 1972 formula
      const { R, z0, c0, c1, c2 } = animationData;
      const time = slowTime.current * undulationSpeed;
      
      for (let i = 0; i < actualParticles; i++) {
        const i3 = i * 3;
        const origX = originalPositions[i3];
        const origY = originalPositions[i3 + 1];
        const origZ = originalPositions[i3 + 2];
        
        const r = Math.sqrt(origX * origX + origZ * origZ);
        const theta = Math.atan2(origZ, origX);
        
        // Reduced undulation effects for biconcave disc
        const radialWave = Math.sin(time * 0.9 + r * 0.025) * 0.06; // Reduced from 0.12 to 0.06
        const angularWave = Math.cos(time * 1.3 + theta * 5) * 0.04; // Reduced from 0.08 to 0.04
        const heightWave = Math.sin(time * 0.7 + r * 0.035 + theta * 3) * 0.09; // Reduced from 0.18 to 0.09
        
        // Active enhancement - also reduced
        const activeWave = isActive ? 
          Math.sin(time * 2.2 + r * 0.06 + theta * 7) * 0.12 : 0; // Reduced from 0.25 to 0.12
        
        const totalWave = radialWave + angularWave + heightWave + activeWave;
        
        // Apply undulation while maintaining Evans & Fung 1972 biconcave shape
        const normalizedR = r / R;
        const rOverR_squared = normalizedR * normalizedR;
        const rOverR_fourth = rOverR_squared * rOverR_squared;
        
        // Evans & Fung 1972 formula with undulation
        const heightFactor = (1 - rOverR_squared) * (c0 + c1 * rOverR_squared + c2 * rOverR_fourth);
        const baseZHeight = z0 * heightFactor;
        const undulatedHeight = baseZHeight * (1 + totalWave);
        
        // Maintain the original sign (top/bottom surface)
        const finalY = (origY >= 0 ? 1 : -1) * Math.abs(undulatedHeight);
        
        positions[i3] = origX * (1 + radialWave * 0.4);
        positions[i3 + 1] = finalY;
        positions[i3 + 2] = origZ * (1 + radialWave * 0.4);
        
        scales[i] = 14 * (1 + Math.abs(totalWave) * 0.4);
      }
      
    } else if (animationType === 'torus') {
      // Torus with undulation
      const { majorRadius, minorRadius } = animationData;
      const time = slowTime.current * undulationSpeed;
      
      for (let i = 0; i < actualParticles; i++) {
        const i3 = i * 3;
        const origX = originalPositions[i3];
        const origY = originalPositions[i3 + 1];
        const origZ = originalPositions[i3 + 2];
        
        // Calculate torus parameters from position
        const distFromCenter = Math.sqrt(origX * origX + origZ * origZ);
        const majorTheta = Math.atan2(origZ, origX);
        const minorTheta = Math.atan2(origY, distFromCenter - majorRadius);
        
        // Undulation effects
        const majorWave = Math.sin(time * 0.7 + majorTheta * 3) * 0.15;
        const minorWave = Math.cos(time * 1.1 + minorTheta * 4) * 0.12;
        const torusWave = Math.sin(time * 0.9 + majorTheta * 2 + minorTheta * 3) * 0.1;
        
        // Active enhancement
        const activeWave = isActive ? 
          Math.sin(time * 2.5 + majorTheta * 5 + minorTheta * 6) * 0.25 : 0;
        
        const totalWave = majorWave + minorWave + torusWave + activeWave;
        
        // Apply undulation to torus geometry
        const undulatedMajorRadius = majorRadius * (1 + majorWave);
        const undulatedMinorRadius = minorRadius * (1 + minorWave + activeWave);
        
        const newX = (undulatedMajorRadius + undulatedMinorRadius * Math.cos(minorTheta)) * Math.cos(majorTheta);
        const newY = undulatedMinorRadius * Math.sin(minorTheta) * (1 + torusWave);
        const newZ = (undulatedMajorRadius + undulatedMinorRadius * Math.cos(minorTheta)) * Math.sin(majorTheta);
        
        positions[i3] = newX;
        positions[i3 + 1] = newY;
        positions[i3 + 2] = newZ;
        
        scales[i] = 12 * (1 + Math.abs(totalWave) * 0.5);
      }
      
    } else if (animationType === 'torus_5_sided') {
      // 5-sided torus with undulation
      const { majorRadius, minorRadius, sides } = animationData;
      const time = slowTime.current;
      
      // Undulation factor: 0 = no movement, 10 = full undulation
      const undulationFactor = undulationSpeed / 10.0;
      
      for (let i = 0; i < actualParticles; i++) {
        const i3 = i * 3;
        const origX = originalPositions[i3];
        const origY = originalPositions[i3 + 1];
        const origZ = originalPositions[i3 + 2];
        
        if (undulationFactor === 0) {
          // No undulation - keep original positions
          positions[i3] = origX;
          positions[i3 + 1] = origY;
          positions[i3 + 2] = origZ;
          scales[i] = 12;
        } else {
          // Calculate torus parameters from position
          const distFromCenter = Math.sqrt(origX * origX + origZ * origZ);
          const majorTheta = Math.atan2(origZ, origX);
          const minorTheta = Math.atan2(origY, distFromCenter - majorRadius);
          
          // Pentagon-specific undulation effects
          const pentagonWave = Math.sin(time * 0.8 * undulationFactor + majorTheta * sides) * 0.12;
          const edgeWave = Math.cos(time * 1.2 * undulationFactor + minorTheta * sides * 2) * 0.10;
          const cornerWave = Math.sin(time * 1.6 * undulationFactor + majorTheta * sides * 1.5 + minorTheta * sides) * 0.08;
          
          // Major and minor radius undulation
          const majorWave = Math.sin(time * 0.6 * undulationFactor + majorTheta * 3) * 0.15;
          const minorWave = Math.cos(time * 1.0 * undulationFactor + minorTheta * 4) * 0.12;
          
          // Active enhancement
          const activeWave = isActive ? 
            Math.sin(time * 2.0 * undulationFactor + majorTheta * sides * 2 + minorTheta * sides * 3) * 0.2 : 0;
          
          const totalWave = (pentagonWave + edgeWave + cornerWave + majorWave + minorWave + activeWave) * undulationFactor;
          
          // Apply undulation to 5-sided torus geometry
          const undulatedMajorRadius = majorRadius * (1 + majorWave * undulationFactor);
          const undulatedMinorRadius = minorRadius * (1 + (minorWave + pentagonWave) * undulationFactor);
          
          // Pentagon edge enhancement
          const edgeEnhancement = 1 + (edgeWave + cornerWave) * undulationFactor;
          
          const newX = (undulatedMajorRadius + undulatedMinorRadius * Math.cos(minorTheta) * edgeEnhancement) * Math.cos(majorTheta);
          const newY = undulatedMinorRadius * Math.sin(minorTheta) * edgeEnhancement * (1 + cornerWave * undulationFactor);
          const newZ = (undulatedMajorRadius + undulatedMinorRadius * Math.cos(minorTheta) * edgeEnhancement) * Math.sin(majorTheta);
          
          positions[i3] = newX;
          positions[i3 + 1] = newY;
          positions[i3 + 2] = newZ;
          
          scales[i] = 12 * (1 + Math.abs(totalWave) * 0.4 * undulationFactor);
        }
      }
      
    } else if (animationType === 'lines_sphere') {
      // AlteredQualia classic lines sphere animation - multiple rotating spheres
      const { baseRadius, numLineSegments, numSpheres, sphereParameters, particlesPerSphere } = animationData;
      const time = slowTime.current;
      
      // Undulation factor: 0 = no movement, 10 = full undulation
      const undulationFactor = undulationSpeed / 10.0;
      
      // Global pulsing zoom effect with easing
      let globalPulseScale = 1.0;
      if (undulationFactor > 0) {
        const pulsePhase = time * 0.002 * undulationFactor; // Slower pulse for dramatic effect
        const rawPulse = Math.sin(pulsePhase);
        
        // Ease in/out cubic function for smooth pulsing
        const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const normalizedPulse = (rawPulse + 1) / 2; // Convert -1,1 to 0,1
        const easedPulse = easeInOutCubic(normalizedPulse);
        
        // Scale between 0.3 and 1.7 for dramatic zoom in/out effect
        globalPulseScale = 0.3 + (easedPulse * 1.4);
      }
      
      let particleIndex = 0;
      
      // Animate each sphere layer
      for (let sphereIdx = 0; sphereIdx < numSpheres && particleIndex < actualParticles; sphereIdx++) {
        const params = sphereParameters[sphereIdx];
        const sphereScale = params[0];
        const sphereColor = params[1];
        const sphereOpacity = params[2];
        
        // AlteredQualia rotation logic: different speeds per sphere
        const sphereRotationSpeed = sphereIdx < 4 ? (sphereIdx + 1) : -(sphereIdx + 1);
        const rotationY = time * 0.01 * sphereRotationSpeed * rotationSpeed;
        
        // Apply global pulse scale to all spheres
        let currentScale = sphereScale * globalPulseScale;
        
        // Process line segments for this sphere
        for (let lineIdx = 0; lineIdx < numLineSegments && particleIndex < actualParticles - 1; lineIdx++) {
          // Get original line segment points
          const i3_1 = particleIndex * 3;
          const i3_2 = (particleIndex + 1) * 3;
          
          const origX1 = originalPositions[i3_1];
          const origY1 = originalPositions[i3_1 + 1];
          const origZ1 = originalPositions[i3_1 + 2];
          
          const origX2 = originalPositions[i3_2];
          const origY2 = originalPositions[i3_2 + 1];
          const origZ2 = originalPositions[i3_2 + 2];
          
          // Apply rotation around Y axis (independent of undulation)
          const cosY = Math.cos(rotationY);
          const sinY = Math.sin(rotationY);
          
          // Rotate first point (sphere center point)
          const rotX1 = origX1 * cosY - origZ1 * sinY;
          const rotZ1 = origX1 * sinY + origZ1 * cosY;
          
          // Calculate line direction from first point
          const lineDirection = new THREE.Vector3(
            origX2 - origX1,
            origY2 - origY1,
            origZ2 - origZ1
          ).normalize();
          
          // Apply lineLength parameter to extend the line
          const baseLineLength = Math.sqrt(
            (origX2 - origX1) ** 2 + 
            (origY2 - origY1) ** 2 + 
            (origZ2 - origZ1) ** 2
          );
          
          const extendedLength = baseLineLength * lineLength;
          
          // Calculate second point position with dynamic line length
          const rotX2 = rotX1 + (lineDirection.x * extendedLength * cosY - lineDirection.z * extendedLength * sinY);
          const rotY2 = origY1 + lineDirection.y * extendedLength;
          const rotZ2 = rotZ1 + (lineDirection.x * extendedLength * sinY + lineDirection.z * extendedLength * cosY);
          
          // Apply scale transformation
          positions[i3_1] = rotX1 * currentScale;
          positions[i3_1 + 1] = origY1 * currentScale;
          positions[i3_1 + 2] = rotZ1 * currentScale;
          
          positions[i3_2] = rotX2 * currentScale;
          positions[i3_2 + 1] = rotY2 * currentScale;
          positions[i3_2 + 2] = rotZ2 * currentScale;
          
          // Note: Line segments don't use scale attribute, so no scale assignment needed
          
          particleIndex += 2; // Move to next line segment (2 particles)
        }
      }
      
    } else if (animationType === 'parametric_spiral_1') {
      // Hypocycloid (spirograph) with undulation
      const time = slowTime.current * undulationSpeed;
      
      for (let i = 0; i < actualParticles; i++) {
        const i3 = i * 3;
        const origX = originalPositions[i3];
        const origY = originalPositions[i3 + 1];
        const origZ = originalPositions[i3 + 2];
        
        const t = i / 120; // Spirograph parameter (updated for new density)
        const distance = Math.sqrt(origX * origX + origZ * origZ);
        
        // Spirograph-specific undulation
        const radialWave = Math.sin(time * 0.8 + t * 3) * 0.15;
        const heightWave = Math.cos(time * 1.2 + distance * 0.02) * 0.2;
        const rotationWave = Math.sin(time * 0.6 + t * 2) * 0.1;
        
        // Active enhancement
        const activeWave = isActive ? 
          Math.sin(time * 2.5 + t * 4) * 0.4 : 0;
        
        const totalWave = radialWave + heightWave + rotationWave + activeWave;
        
        // Apply undulation while maintaining spirograph pattern
        positions[i3] = origX * (1 + radialWave);
        positions[i3 + 1] = origY + (heightWave + activeWave) * 30;
        positions[i3 + 2] = origZ * (1 + radialWave);
        
        scales[i] = 13 * (1 + Math.abs(totalWave) * 0.5);
      }
      
    } else if (animationType === 'parametric_spiral_2') {
      // Epicycloid (spirograph) with undulation
      const time = slowTime.current * undulationSpeed;
      
      for (let i = 0; i < actualParticles; i++) {
        const i3 = i * 3;
        const origX = originalPositions[i3];
        const origY = originalPositions[i3 + 1];
        const origZ = originalPositions[i3 + 2];
        
        const t = i / 150; // Spirograph parameter (updated for new density)
        const distance = Math.sqrt(origX * origX + origZ * origZ);
        
        // Epicycloid-specific undulation (different from hypocycloid)
        const radialWave = Math.cos(time * 0.9 + t * 2.5) * 0.18;
        const heightWave = Math.sin(time * 1.4 + distance * 0.015) * 0.22;
        const rotationWave = Math.cos(time * 0.7 + t * 3) * 0.12;
        
        // Active enhancement
        const activeWave = isActive ? 
          Math.cos(time * 3.0 + t * 5) * 0.45 : 0;
        
        const totalWave = radialWave + heightWave + rotationWave + activeWave;
        
        // Apply undulation while maintaining spirograph pattern
        positions[i3] = origX * (1 + radialWave);
        positions[i3 + 1] = origY + (heightWave + activeWave) * 35;
        positions[i3 + 2] = origZ * (1 + radialWave);
        
        scales[i] = 13 * (1 + Math.abs(totalWave) * 0.5);
      }
    }
    
    // Ensure invisible particles stay invisible (only for point-based demos)
    if (scales) {
      for (let i = actualParticles; i < particles.numParticles; i++) {
        scales[i] = 0;
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    if (pointsRef.current.geometry.attributes.scale) {
      pointsRef.current.geometry.attributes.scale.needsUpdate = true;
    }
  });

  return (
    <group>
      {animationType === 'lines_sphere' ? (
        // Use line segments for lines_sphere
        <lineSegments ref={pointsRef} material={lineMaterial}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={particles.positions}
              count={particles.numParticles}
              itemSize={3}
            />
          </bufferGeometry>
        </lineSegments>
      ) : (
        // Use points for all other demos
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
      )}
    </group>
  );
  };
  
  export default WaveVisualizer; 