import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Stars, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Custom volumetric corona shader
const VolumetricCoronaMaterial = {
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color('#ff6a00') },
    opacity: { value: 0.5 },
    noiseScale: { value: 1.0 },
    falloff: { value: 2.0 }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 color;
    uniform float opacity;
    uniform float noiseScale;
    uniform float falloff;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    // Simple noise function
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    void main() {
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(vUv, center);
      
      // Create volumetric falloff
      float falloffFactor = 1.0 - smoothstep(0.0, 0.5, dist);
      falloffFactor = pow(falloffFactor, falloff);
      
      // Add noise for organic look
      vec2 noiseUv = vUv * noiseScale + time * 0.1;
      float noiseValue = noise(noiseUv) * 0.3 + 0.7;
      
      // Combine effects
      float alpha = falloffFactor * noiseValue * opacity;
      
      gl_FragColor = vec4(color, alpha);
    }
  `
};

// Lens flare effect
function LensFlare({ position, size = 1.0, color = '#ffffff' }) {
  const mesh = useRef();
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.lookAt(state.camera.position);
      mesh.current.material.opacity = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.2;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function UmbraEclipse({ undulationSpeed = 1.0, colorTransition1 = 0.5, colorTransition2 = 0.8, colorTransition3 = 0.7 }) {
  const coronaRef = useRef();
  const corona2Ref = useRef();
  const corona3Ref = useRef();
  const { gl } = useThree();

  // Enable HDR and tone mapping - Fixed for newer Three.js versions
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.2;
    // Use SRGBColorSpace instead of deprecated sRGBEncoding
    gl.outputColorSpace = THREE.SRGBColorSpace;
  }, [gl]);

  // Create volumetric corona material
  const volumetricMaterial = useMemo(() => {
    return new THREE.ShaderMaterial(VolumetricCoronaMaterial);
  }, []);

  // Create PBR materials for realistic surfaces
  const umbraMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#000000',
      metalness: 0.0,
      roughness: 1.0,
      transmission: 0.0,
      ior: 1.0
    });
  }, []);

  // Animate corona and update shaders
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Rotate corona layers
    if (coronaRef.current) {
      coronaRef.current.rotation.z += 0.002 * undulationSpeed;
    }
    if (corona2Ref.current) {
      corona2Ref.current.rotation.z -= 0.001 * undulationSpeed;
    }
    if (corona3Ref.current) {
      corona3Ref.current.rotation.z += 0.0015 * undulationSpeed;
    }

    // Update volumetric shader
    if (volumetricMaterial) {
      volumetricMaterial.uniforms.time.value = time;
    }
  });

  // Corona colors with HDR values
  const coronaColor1 = new THREE.Color('#ff6a00').multiplyScalar(2.0); // HDR bright
  const coronaColor2 = new THREE.Color('#ff8c42').multiplyScalar(1.5);
  const coronaColor3 = new THREE.Color('#ff9944').multiplyScalar(1.2);

  return (
    <group position={[0, 0, 0]} scale={[20, 20, 20]}>
      {/* HDR Environment mapping for space */}
      <Environment preset="night" />
      
      {/* Deep space background with subtle stars */}
      <color attach="background" args={["#000000"]} />
      
      {/* Umbra sphere - Larger moon to almost completely cover the sun */}
      <mesh>
        <sphereGeometry args={[1.02, 128, 128]} />
        <primitive object={umbraMaterial} />
      </mesh>

      {/* Thicker corona outline - More visible around moon edge */}
      <mesh ref={coronaRef}>
        <ringGeometry args={[1.02, 1.07, 128]} />
        <meshPhysicalMaterial
          color={coronaColor1}
          transparent
          opacity={0.95}
          transmission={0.1}
          thickness={0.03}
          roughness={0.05}
          metalness={0.0}
          emissive={coronaColor1}
          emissiveIntensity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Secondary corona ring */}
      <mesh ref={coronaRef}>
        <ringGeometry args={[1.07, 1.12, 128]} />
        <meshPhysicalMaterial
          color={coronaColor1}
          transparent
          opacity={0.7}
          transmission={0.2}
          thickness={0.04}
          roughness={0.1}
          emissive={coronaColor1}
          emissiveIntensity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* More diffuse inner glow - Spread out further */}
      <mesh ref={coronaRef}>
        <ringGeometry args={[1.12, 1.5, 64]} />
        <meshPhysicalMaterial
          color={coronaColor2}
          transparent
          opacity={0.15}
          transmission={0.8}
          thickness={0.4}
          roughness={0.7}
          emissive={coronaColor2}
          emissiveIntensity={0.06}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Very diffuse middle glow - Much more spread */}
      <mesh ref={corona2Ref}>
        <ringGeometry args={[1.5, 2.3, 32]} />
        <meshPhysicalMaterial
          color={coronaColor3}
          transparent
          opacity={0.08}
          transmission={0.85}
          thickness={0.6}
          roughness={0.85}
          emissive={coronaColor3}
          emissiveIntensity={0.02}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Extremely diffuse outer glow - Very spread out */}
      <mesh ref={corona3Ref}>
        <ringGeometry args={[2.3, 3.5, 32]} />
        <meshPhysicalMaterial
          color={coronaColor3}
          transparent
          opacity={0.03}
          transmission={0.95}
          thickness={1.0}
          roughness={0.95}
          emissive={coronaColor3}
          emissiveIntensity={0.008}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Subtle corona streamers - Slightly larger */}
      <mesh ref={corona2Ref} rotation={[0, 0, Math.PI / 4]}>
        <ringGeometry args={[1.08, 1.18, 16]} />
        <meshPhysicalMaterial
          color={coronaColor1}
          transparent
          opacity={0.25}
          transmission={0.5}
          thickness={0.15}
          roughness={0.4}
          emissive={coronaColor1}
          emissiveIntensity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Another subtle streamer */}
      <mesh ref={corona3Ref} rotation={[0, 0, -Math.PI / 6]}>
        <ringGeometry args={[1.06, 1.14, 16]} />
        <meshPhysicalMaterial
          color={coronaColor1}
          transparent
          opacity={0.3}
          transmission={0.4}
          thickness={0.08}
          roughness={0.3}
          emissive={coronaColor1}
          emissiveIntensity={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Solar prominences - Tiny red flares just at moon edge */}
      <mesh ref={corona2Ref} rotation={[0, 0, Math.PI / 3]}>
        <ringGeometry args={[1.019, 1.025, 16]} />
        <meshPhysicalMaterial
          color="#ff3366"
          transparent
          opacity={0.8}
          emissive="#ff3366"
          emissiveIntensity={0.6}
          roughness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={corona3Ref} rotation={[0, 0, -Math.PI / 2]}>
        <ringGeometry args={[1.018, 1.023, 12]} />
        <meshPhysicalMaterial
          color="#ff2255"
          transparent
          opacity={0.6}
          emissive="#ff2255"
          emissiveIntensity={0.4}
          roughness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Very subtle lens flares */}
      <LensFlare position={[0, 0, 0.1]} size={0.1} color="#ffaa00" />
      <LensFlare position={[0.05, 0.03, 0.1]} size={0.05} color="#ff6a00" />

      {/* Minimal film grain */}
      <Sparkles
        count={30}
        scale={[8, 8, 8]}
        size={0.1}
        speed={0.02}
        opacity={0.005}
        color="#ffffff"
      />

      {/* Realistic star field */}
      <Stars
        radius={100}
        depth={50}
        count={500}
        factor={0.3}
        saturation={0}
        fade
        speed={0.1}
      />
    </group>
  );
}

export default UmbraEclipse; 