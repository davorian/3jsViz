import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { AnimatePresence } from 'framer-motion';
import FilmVisualization from './FilmVisualization';
import DemoControls from './DemoControls';
import DemoInfo from './DemoInfo';
import SnapshotManager from './SnapshotManager';

const demoData = {
  puncture: {
    id: 'puncture',
    title: 'Pitted Surface',
    description: 'Punctured membrane with controlled surface deformation. This pattern mimics cellular membrane invagination found in endocytosis, where cells create surface pockets to absorb materials. The dynamic pitting responds to environmental pressure changes, similar to how plant stomata open and close. Adjustable parameters: Undulation Speed controls the rate of surface deformation and recovery cycles.',
    icon: 'wave',
    color: '#d3b166',
    animation: 'punctureTest'
  },
  flexibility: {
    id: 'flexibility',
    title: 'Wave Undulation',
    description: 'Sinusoidal wave pattern demonstrating flexible membrane dynamics. This undulating motion resembles ocean waves, sound wave propagation, or the rhythmic contractions of intestinal peristalsis that move food through the digestive system. The wave amplitude and frequency can be controlled to study resonance effects. Adjustable parameters: Undulation Speed controls wave frequency and amplitude intensity.',
    icon: 'line',
    color: '#d3b166',
    animation: 'flexibilityTest'
  },
  stretch: {
    id: 'stretch',
    title: 'Elastic Deformation',
    description: 'Planar stretching and compression demonstrating elastic membrane properties. This behavior mimics muscle fiber elongation during contraction, elastic tissue in blood vessel walls responding to blood pressure, or the stretching of spider silk under tension. The material maintains structural integrity while deforming. Adjustable parameters: Undulation Speed controls the rate and intensity of elastic deformation cycles.',
    icon: 'square',
    color: '#d3b166',
    animation: 'stretchTest'
  },
  cling: {
    id: 'cling',
    title: 'Spherical Adhesion',
    description: 'Perfect sphere demonstrating uniform adhesion properties. This spherical form represents soap bubbles, cell membranes maintaining spherical shape due to surface tension, or water droplets on hydrophobic surfaces. The sphere minimizes surface area while maximizing volume efficiency. Adjustable parameters: Undulation Speed controls surface tension fluctuations and membrane flexibility.',
    icon: 'circle',
    color: '#d3b166',
    animation: 'clingTest'
  },
  retention: {
    id: 'retention',
    title: 'Cubic Stability',
    description: 'Static cubic structure demonstrating rigid retention properties. This geometric form represents crystal lattice structures in minerals, the organized arrangement of atoms in salt crystals, or the hexagonal close-packed structure in metals. The cube maintains perfect structural integrity and dimensional stability. Adjustable parameters: Undulation Speed controls subtle vibrational movements within the rigid framework.',
    icon: 'triangle',
    color: '#d3b166',
    animation: 'retentionTest'
  },
  stability: {
    id: 'stability',
    title: 'Icosahedral Dynamics',
    description: 'Twenty-faced icosahedral structure with pulsating dynamics. This polyhedron appears in virus capsids like adenovirus, fullerene carbon molecules (buckyballs), and geodesic dome architecture. The icosahedron represents optimal spherical packing with maximum structural efficiency and minimal surface energy. Adjustable parameters: Undulation Speed controls pulsation rhythm and vertex displacement intensity.',
    icon: 'diamond',
    color: '#d3b166',
    animation: 'stabilityTest'
  },
  organic: {
    id: 'organic',
    title: 'Oblate Spheroid',
    description: 'Flattened spherical structure resembling organic cellular forms. This oblate shape occurs in red blood cells, flattened planets like Saturn due to rotation, soap bubbles under pressure, and many bacterial cell shapes. The oblate geometry optimizes surface area for nutrient exchange while maintaining structural integrity. Adjustable parameters: Particle Density controls point distribution, Undulation Speed controls organic rippling motion.',
    icon: 'oval',
    color: '#d3b166',
    animation: 'organicTest'
  },
  fibonacci_sphere: {
    id: 'fibonacci_sphere',
    title: 'Fibonacci Sphere',
    description: 'Spherical surface with particles distributed using Fibonacci spiral mathematics. This pattern appears in sunflower seed arrangements, pinecone scales, nautilus shells, and galaxy spiral arms. The golden ratio (φ ≈ 1.618) creates optimal packing density with minimal gaps. Found in phyllotaxis - the arrangement of leaves, petals, and seeds in plants. Adjustable parameters: Fibonacci Density controls particle count, Undulation Speed controls surface wave motion.',
    icon: 'circle',
    color: '#d3b166',
    animation: 'fibonacciSphereTest'
  },
  fibonacci_disc: {
    id: 'fibonacci_disc',
    title: 'Fibonacci Disc',
    description: 'Flat circular disc with radial Fibonacci spiral particle distribution. This pattern is most famously seen in sunflower heads, daisy centers, and pinecone surfaces. The spiral follows the golden angle (137.5°) creating optimal seed packing without gaps or overlaps. Also appears in romanesco broccoli fractals and succulent plant arrangements. Adjustable parameters: Fibonacci Density controls spiral tightness and particle count, Undulation Speed controls radial wave propagation.',
    icon: 'disc',
    color: '#d3b166',
    animation: 'fibonacciDiscTest'
  },
  biconvex_disc: {
    id: 'biconvex_disc',
    title: 'Biconvex Lens',
    description: 'Double-convex lens shape with outward-curving surfaces on both sides. This form appears in optical lenses for magnification, the crystalline lens in human eyes for focusing light, and water droplets forming convex shapes due to surface tension. The biconvex geometry focuses parallel light rays to a point, essential for vision and optical instruments. Adjustable parameters: Fibonacci Density controls particle distribution across curved surfaces, Undulation Speed controls lens surface deformation.',
    icon: 'biconvex',
    color: '#d3b166',
    animation: 'biconvexDiscTest'
  },
  biconcave_disc: {
    id: 'biconcave_disc',
    title: 'Biconcave Disc (Erythrocyte)',
    description: 'Double-concave disc shape identical to human red blood cells (erythrocytes). This unique geometry maximizes surface area for oxygen exchange while maintaining flexibility to squeeze through tiny capillaries. The biconcave shape also provides structural stability without a nucleus, allowing maximum hemoglobin packing. Also seen in some diatoms and optical elements. Adjustable parameters: Fibonacci Density controls cell membrane particle distribution, Undulation Speed controls membrane flexibility and deformation.',
    icon: 'biconcave',
    color: '#d3b166',
    animation: 'biconcaveDiscTest'
  },
  torus: {
    id: 'torus',
    title: 'Torus (Donut Shape)',
    description: 'Ring-shaped surface generated by rotating a circle around an axis. This topology appears in magnetic field lines around planets, tokamak fusion reactor chambers, donut-shaped fruits like certain gourds, and the overall shape of some bacteria. The torus has unique mathematical properties with genus-1 topology and appears in advanced physics and engineering applications. Adjustable parameters: Fibonacci Density controls particle distribution across the toroidal surface, Undulation Speed controls surface wave propagation around the ring.',
    icon: 'torus',
    color: '#d3b166',
    animation: 'torusTest'
  },
  torus_5_sided: {
    id: 'torus_5_sided',
    title: 'Pentagonal Torus',
    description: 'Five-sided toroidal structure with pentagonal cross-section. This geometry combines the ring topology of a torus with the five-fold symmetry found in biological systems like starfish, flowers (pentamerous), and some viral capsids. The pentagon appears frequently in nature due to its relationship with the golden ratio and optimal packing efficiency. Adjustable parameters: Fibonacci Density controls vertex and edge particle distribution, Undulation Speed controls pentagon-specific edge wave patterns and corner dynamics.',
    icon: 'pentagon-torus',
    color: '#d3b166',
    animation: 'torus5SidedTest'
  },
  parametric_spiral_1: {
    id: 'parametric_spiral_1',
    title: 'Hypocycloid Spiral',
    description: 'Mathematical curve traced by a point on a small circle rolling inside a larger fixed circle. This spirograph pattern appears in planetary gear mechanisms, Wankel rotary engines, and some flower petal arrangements. The hypocycloid demonstrates epicyclic motion found in astronomy (planetary orbits) and mechanical engineering. Adjustable parameters: Particle Density controls curve resolution, Undulation Speed controls animation rhythm, R/r/d parameters control the rolling circle geometry for different curve shapes.',
    icon: 'spiral',
    color: '#d3b166',
    animation: 'parametricSpiral1Test'
  },
  parametric_spiral_2: {
    id: 'parametric_spiral_2',
    title: 'Epicycloid Spiral',
    description: 'Mathematical curve traced by a point on a small circle rolling around the outside of a larger fixed circle. This spirograph pattern creates flower-like shapes seen in gear tooth profiles, decorative rosettes, and some radiolarian microorganism shells. The epicycloid demonstrates external rolling motion with applications in mechanical cam design and architectural ornamentation. Adjustable parameters: Particle Density controls curve smoothness, Undulation Speed controls rotation rhythm, R/r/d parameters control the external rolling circle geometry for various petal counts.',
    icon: 'spiral2',
    color: '#d3b166',
    animation: 'parametricSpiral2Test'
  },
  multi_sphere_25: {
    id: 'multi_sphere_25',
    title: 'Heavy Atom Model (25x)',
    description: 'Multi-shell atomic structure representing heavy elements like iron or copper with many electron shells. The central nucleus is surrounded by 80 smaller electron spheres arranged in quantum orbital shells, mimicking electron probability clouds in atoms. This model demonstrates the Bohr model concept and electron shell filling patterns (2, 8, 18, 32...). Also resembles fullerene cage structures and viral capsid organization. Adjustable parameters: Fibonacci Density controls electron distribution within shells, Undulation Speed controls orbital motion and electron cloud dynamics.',
    icon: 'atom',
    color: '#d3b166',
    animation: 'multiSphere25Test'
  },
  multi_sphere_10: {
    id: 'multi_sphere_10',
    title: 'Light Atom Model (10x)',
    description: 'Simplified atomic structure representing lighter elements like neon or sodium with fewer electron shells. Contains 24 medium-sized electron spheres in concentric shells around a central nucleus, demonstrating the basic atomic orbital structure. This model shows electron shell filling in lighter elements and resembles molecular cluster arrangements like C60 buckminsterfullerene. Also found in spherical virus structures and nanoparticle assemblies. Adjustable parameters: Fibonacci Density controls electron positioning within orbital shells, Undulation Speed controls atomic vibration and electron motion patterns.',
    icon: 'atom',
    color: '#d3b166',
    animation: 'multiSphere10Test'
  },
  lines_sphere: {
    id: 'lines_sphere',
    title: 'Radial Line Sphere',
    description: 'Concentric spheres composed of radiating line segments, recreating the classic AlteredQualia WebGL visualization. This structure resembles sea urchin spines, radiolarian skeletons, dandelion seed heads, or magnetic field line visualizations around spherical objects. The radial symmetry demonstrates how nature often uses spoke-like patterns for structural support and efficient space filling. Adjustable parameters: Particle Density controls line segment count, Rotation Speed controls sphere rotation rates, Undulation Speed controls pulsing amplitude and timing.',
    icon: 'lines-sphere',
    color: '#d3b166',
    animation: 'linesSphereTest'
  },
  jellyfish_medusae: {
    id: 'jellyfish_medusae',
    title: 'Particulate Medusae',
    description: 'Soft-body jellyfish simulation with physics-based particle systems. This visualization recreates the organic, flowing movement of jellyfish bell contractions and tentacle undulations. The particle system uses spring constraints and damping forces to create realistic soft-body dynamics, similar to how jellyfish propel themselves through water. The bell pulsation creates vortex rings for efficient locomotion. Environmental particles simulate the underwater habitat. Adjustable parameters: Undulation Speed controls pulsation frequency, Particle Density affects simulation detail and tentacle count, Color Transitions modify the bioluminescent appearance.',
    icon: 'jellyfish',
    color: '#4a90e2',
    animation: 'jellyfishMedusaeTest'
  },

  eclipse: {
    id: 'eclipse',
    title: 'Solar Eclipse',
    description: 'A stunning solar eclipse visualization featuring a black central disc surrounded by a luminous corona. This celestial phenomenon recreates the breathtaking moment when the moon passes between Earth and the Sun, revealing the Sun\'s corona - the outermost layer of its atmosphere. The corona appears as multiple translucent rings of varying opacity, creating a realistic glow effect. The gentle rotation simulates the dynamic nature of solar plasma and magnetic field lines. Adjustable parameters: Undulation Speed controls corona rotation and plasma movement, Color Transitions modify the corona\'s spectral appearance from traditional orange to custom hues.',
    icon: 'eclipse',
    color: '#ff8c00',
    animation: 'eclipseTest'
  },

  immune_system: {
    id: 'immune_system',
    title: 'Immune System Dynamics',
    description: 'Interactive 2D canvas visualization of immune system cellular behavior with real-time parameter control. This simulation models immune cells as white particles that oscillate, collide, and interact based on key biological factors: Inflamaging (inflammatory aging), Protection Score (immune strength), Immune Age (system maturity), Cellular Damage (stress response), and Dot Size (cell scale). The particles exhibit emergent behaviors including collision detection, oscillatory movement, and trail effects that visualize immune system dynamics over time. Built with HTML5 Canvas for smooth 60fps animation and interactive slider controls.',
    icon: 'immune',
    color: '#00ff88',
    animation: 'immuneSystemTest'
  },

  sphere_lines: {
    id: 'sphere_lines',
    title: 'Latitude/Longitude Sphere',
    description: 'A sphere constructed entirely from latitude and longitude lines, creating a wireframe globe-like structure. Latitude lines run horizontally from the southern pole to the northern pole, while longitude lines run vertically from the 0-degree meridian. The number of lines is fully parameterizable, allowing you to create anything from a simple grid to a dense wireframe. Lines animate in with smooth tweening effects, and the entire structure rotates gently. This visualization demonstrates spherical coordinate systems used in geography, astronomy, and 3D graphics.',
    icon: 'sphere-lines',
    color: '#4a90e2',
    animation: 'sphereLinesTest'
  }
};

const QuantumDemo = () => {
  const [activeDemo, setActiveDemo] = useState('jellyfish_medusae');
  const [showInfo, setShowInfo] = useState(true);
  const [showControls, setShowControls] = useState(false); // Toggle with Shift+C
  const [undulationSpeed, setUndulationSpeed] = useState(1.0);
  
  // New control states
  const [fibonacciDensity, setFibonacciDensity] = useState(1.0);
  const [density, setDensity] = useState(1.0);
  const [rotationSpeed, setRotationSpeed] = useState(1.0);
  const [lineLength, setLineLength] = useState(1.0);
  const [colorTransition1, setColorTransition1] = useState(0.5); // Hue shift
  const [colorTransition2, setColorTransition2] = useState(0.8); // Saturation
  const [colorTransition3, setColorTransition3] = useState(0.7); // Brightness
  
  // Sphere lines parameters
  const [latitudeLines, setLatitudeLines] = useState(10);
  const [longitudeLines, setLongitudeLines] = useState(16);
  
  // Spirograph parameters
  const [spiralParams, setSpiralParams] = useState({
    spiral1: {
      R: 120,      // Fixed circle radius (hypocycloid)
      r: 30,       // Rolling circle radius
      d: 50,       // Distance from center of rolling circle to pen
      rotations: 8 // Number of rotations to draw
    },
    spiral2: {
      R: 80,       // Fixed circle radius (epicycloid)
      r: 25,       // Rolling circle radius
      d: 40,       // Distance from center of rolling circle to pen
      rotations: 6 // Number of rotations to draw
    }
  });

  // Snapshot management with localStorage persistence
  const [snapshots, setSnapshots] = useState(() => {
    try {
      const saved = localStorage.getItem('quantumDemo_snapshots');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading snapshots from localStorage:', error);
      return [];
    }
  });
  
  // Camera controls ref for capturing camera state
  const controlsRef = useRef();

  // Default configuration values
  const defaultConfig = {
    undulationSpeed: 1.0,
    fibonacciDensity: 1.0,
    density: 1.0,
    rotationSpeed: 1.0,
    lineLength: 1.0,
    colorTransition1: 0.5,
    colorTransition2: 0.8,
    colorTransition3: 0.7,
    latitudeLines: 10,
    longitudeLines: 16,
    spiralParams: {
      spiral1: { R: 120, r: 30, d: 50, rotations: 8 },
      spiral2: { R: 80, r: 25, d: 40, rotations: 6 }
    },
    camera: {
      position: [0, 0, 350],
      target: [0, 0, 0]
    }
  };

  useEffect(() => {
    // Show info panel after a short delay
    const timer = setTimeout(() => setShowInfo(true), 500);
    return () => clearTimeout(timer);
  }, [activeDemo]);

  // Save snapshots to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('quantumDemo_snapshots', JSON.stringify(snapshots));
    } catch (error) {
      console.error('Error saving snapshots to localStorage:', error);
    }
  }, [snapshots]);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check for Shift+C
      if (event.shiftKey && event.key.toLowerCase() === 'c') {
        event.preventDefault();
        setShowControls(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDemoChange = (demoId) => {
    if (demoId !== activeDemo) {
      setActiveDemo(demoId);
      setShowInfo(false);
      
      // Show info after demo change
      setTimeout(() => setShowInfo(true), 300);
    }
  };

  // Snapshot handlers
  const handleSaveSnapshot = (snapshot) => {
    setSnapshots(prev => [...prev, snapshot]);
  };

  const handleLoadSnapshot = (snapshot) => {
    setActiveDemo(snapshot.demo);
    setUndulationSpeed(snapshot.config.undulationSpeed || defaultConfig.undulationSpeed);
    setFibonacciDensity(snapshot.config.fibonacciDensity || defaultConfig.fibonacciDensity);
    setDensity(snapshot.config.density || defaultConfig.density);
    setRotationSpeed(snapshot.config.rotationSpeed || defaultConfig.rotationSpeed);
    setLineLength(snapshot.config.lineLength || defaultConfig.lineLength);
    setColorTransition1(snapshot.config.colorTransition1 || defaultConfig.colorTransition1);
    setColorTransition2(snapshot.config.colorTransition2 || defaultConfig.colorTransition2);
    setColorTransition3(snapshot.config.colorTransition3 || defaultConfig.colorTransition3);
    setLatitudeLines(snapshot.config.latitudeLines || defaultConfig.latitudeLines);
    setLongitudeLines(snapshot.config.longitudeLines || defaultConfig.longitudeLines);
    setSpiralParams(snapshot.config.spiralParams || defaultConfig.spiralParams);
    
    // Restore camera state
    if (snapshot.config.camera && controlsRef.current) {
      const camera = controlsRef.current.object;
      const target = controlsRef.current.target;
      
      // Set camera position
      camera.position.set(
        snapshot.config.camera.position[0],
        snapshot.config.camera.position[1],
        snapshot.config.camera.position[2]
      );
      
      // Set camera target
      target.set(
        snapshot.config.camera.target[0],
        snapshot.config.camera.target[1],
        snapshot.config.camera.target[2]
      );
      
      // Update the controls
      controlsRef.current.update();
    }
    
    setShowInfo(false);
    setTimeout(() => setShowInfo(true), 300);
  };

  const handleDeleteSnapshot = (snapshotId) => {
    setSnapshots(prev => prev.filter(s => s.id !== snapshotId));
  };

  const handleRestoreDefaults = () => {
    setUndulationSpeed(defaultConfig.undulationSpeed);
    setFibonacciDensity(defaultConfig.fibonacciDensity);
    setDensity(defaultConfig.density);
    setRotationSpeed(defaultConfig.rotationSpeed);
    setLineLength(defaultConfig.lineLength);
    setColorTransition1(defaultConfig.colorTransition1);
    setColorTransition2(defaultConfig.colorTransition2);
    setColorTransition3(defaultConfig.colorTransition3);
    setLatitudeLines(defaultConfig.latitudeLines);
    setLongitudeLines(defaultConfig.longitudeLines);
    setSpiralParams(defaultConfig.spiralParams);
    
    // Restore default camera state
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      const target = controlsRef.current.target;
      
      // Reset camera position
      camera.position.set(
        defaultConfig.camera.position[0],
        defaultConfig.camera.position[1],
        defaultConfig.camera.position[2]
      );
      
      // Reset camera target
      target.set(
        defaultConfig.camera.target[0],
        defaultConfig.camera.target[1],
        defaultConfig.camera.target[2]
      );
      
      // Update the controls
      controlsRef.current.update();
    }
  };

  // Get current configuration for snapshot saving
  const getCurrentConfig = () => {
    // Capture current camera state if controls are available
    let cameraState = defaultConfig.camera;
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      const target = controlsRef.current.target;
      cameraState = {
        position: [camera.position.x, camera.position.y, camera.position.z],
        target: [target.x, target.y, target.z]
      };
    }
    
    return {
      demo: activeDemo,
      undulationSpeed,
      fibonacciDensity,
      density,
      rotationSpeed,
      lineLength,
      colorTransition1,
      colorTransition2,
      colorTransition3,
      latitudeLines,
      longitudeLines,
      spiralParams,
      camera: cameraState
    };
  };

  const currentDemo = demoData[activeDemo];

  return (
    <div className="quantum-demo">
      <div className="demo-container">
        <div className="demo-3d-scene">
          <Canvas
            camera={{ 
              position: [0, 0, 350], 
              fov: 60,
              near: 1,     // Close clipping plane
              far: 10000   // Extended far clipping plane to prevent disappearing when zoomed out
            }}
            style={{ background: activeDemo === 'eclipse' ? '#000000' : '#001122' }}
            gl={{ antialias: true, alpha: false }}
          >
            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 10, 5]} intensity={0.5} />
            <pointLight position={[-10, -10, -5]} intensity={0.3} color="#d3b166" />
            
            <FilmVisualization 
              demo={activeDemo}
              isPlaying={true}
              undulationSpeed={undulationSpeed}
              fibonacciDensity={fibonacciDensity}
              density={density}
              rotationSpeed={rotationSpeed}
              lineLength={lineLength}
              colorTransition1={colorTransition1}
              colorTransition2={colorTransition2}
              colorTransition3={colorTransition3}
              spiralParams={spiralParams}
              latitudeLines={latitudeLines}
              longitudeLines={longitudeLines}
            />
            
            <OrbitControls
              ref={controlsRef}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              maxDistance={2000} // Increased from 800 to 2000 for much more zoom out capability
              minDistance={50}   // Reduced from 100 to 50 for closer zoom in as well
              autoRotate={false}
              autoRotateSpeed={0.5}
            />
            
            <Environment preset="night" />
          </Canvas>
        </div>

        {/* Demo Navigation Buttons and ALL controls - first button at same height as undulation panel */}
        {showControls && (
          <div style={{
            position: 'fixed',
            top: '20px', // Moved container top down by 100px (-80px + 100px = 20px)
            left: '20px',
            bottom: '120px', // Adjusted bottom to maintain height (220px - 100px = 120px)
            zIndex: 1000,
            overflowY: 'auto',
            background: 'rgba(0, 0, 0, 0.9)',
            padding: '15px 20px',
            borderRadius: '8px',
            backdropFilter: 'blur(8px)',
            border: '3px solid #ffcc44',
            minWidth: '300px',
            width: '350px'
          }}>
            <DemoControls
              demos={Object.values(demoData)}
              activeDemo={activeDemo}
              onDemoChange={handleDemoChange}
              fibonacciDensity={fibonacciDensity}
              onFibonacciDensityChange={setFibonacciDensity}
              density={density}
              onDensityChange={setDensity}
              rotationSpeed={rotationSpeed}
              onRotationSpeedChange={setRotationSpeed}
              lineLength={lineLength}
              onLineLengthChange={setLineLength}
              colorTransition1={colorTransition1}
              colorTransition2={colorTransition2}
              colorTransition3={colorTransition3}
              onColorTransition1Change={setColorTransition1}
              onColorTransition2Change={setColorTransition2}
              onColorTransition3Change={setColorTransition3}
              spiralParams={spiralParams}
              onSpiralParamsChange={setSpiralParams}
              latitudeLines={latitudeLines}
              onLatitudeLinesChange={setLatitudeLines}
              longitudeLines={longitudeLines}
              onLongitudeLinesChange={setLongitudeLines}
            />
          </div>
        )}

        {/* Speed Control Slider - only show when controls are visible */}
        {showControls && (
          <>
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(0, 0, 0, 0.7)',
              padding: '15px 20px',
              borderRadius: '8px',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 204, 68, 0.3)',
              zIndex: 1000,
              minWidth: '220px'
            }}>
              <label style={{
                color: '#ffcc44',
                fontSize: '14px',
                fontFamily: 'monospace',
                display: 'block',
                marginBottom: '8px'
              }}>
                Undulation Speed: {undulationSpeed === 0 ? 'Still' : `${undulationSpeed.toFixed(1)}x`}
              </label>
              <input
                type="range"
                min="0"
                max="10.0"
                step="0.1"
                value={undulationSpeed}
                onChange={(e) => setUndulationSpeed(parseFloat(e.target.value))}
                style={{
                  width: '180px',
                  height: '4px',
                  background: 'rgba(255, 204, 68, 0.3)',
                  borderRadius: '2px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />

              {/* Color Transition Controls */}
              <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255, 204, 68, 0.2)' }}>
                <h4 style={{ 
                  color: '#ffcc44', 
                  fontSize: '13px', 
                  marginBottom: '10px',
                  fontWeight: 'normal',
                  fontFamily: 'monospace'
                }}>
                  Color Transitions
                </h4>
                
                <div style={{ marginBottom: '8px' }}>
                  <label style={{ 
                    color: '#ecffff', 
                    fontSize: '11px', 
                    marginBottom: '4px', 
                    display: 'block',
                    fontFamily: 'monospace'
                  }}>
                    Hue Shift: {(colorTransition1 * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={colorTransition1}
                    onChange={(e) => setColorTransition1(parseFloat(e.target.value))}
                    style={{
                      width: '180px',
                      height: '3px',
                      background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                      borderRadius: '2px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '8px' }}>
                  <label style={{ 
                    color: '#ecffff', 
                    fontSize: '11px', 
                    marginBottom: '4px', 
                    display: 'block',
                    fontFamily: 'monospace'
                  }}>
                    Saturation: {(colorTransition2 * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={colorTransition2}
                    onChange={(e) => setColorTransition2(parseFloat(e.target.value))}
                    style={{
                      width: '180px',
                      height: '3px',
                      background: 'linear-gradient(to right, #808080, #ffcc44)',
                      borderRadius: '2px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    color: '#ecffff', 
                    fontSize: '11px', 
                    marginBottom: '4px', 
                    display: 'block',
                    fontFamily: 'monospace'
                  }}>
                    Brightness: {(colorTransition3 * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={colorTransition3}
                    onChange={(e) => setColorTransition3(parseFloat(e.target.value))}
                    style={{
                      width: '180px',
                      height: '3px',
                      background: 'linear-gradient(to right, #000000, #ffcc44)',
                      borderRadius: '2px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {showInfo && (
                <DemoInfo
                  demo={currentDemo}
                  isVisible={showInfo}
                />
              )}
            </AnimatePresence>
          </>
        )}

        {/* Show keyboard hint when controls are hidden */}
        {!showControls && (
          <div style={{
            position: 'absolute',
            bottom: '140px', // Moved up to accommodate snapshot manager
            right: '20px',
            color: '#ffcc44',
            fontSize: '14px',
            fontFamily: 'monospace',
            background: 'rgba(0, 0, 0, 0.5)',
            padding: '8px 12px',
            borderRadius: '4px',
            backdropFilter: 'blur(4px)',
            zIndex: 1000
          }}>
            Press Shift+C to toggle controls
          </div>
        )}

        {/* Snapshot Manager - always visible at top */}
        <SnapshotManager
          snapshots={snapshots}
          onSaveSnapshot={handleSaveSnapshot}
          onLoadSnapshot={handleLoadSnapshot}
          onDeleteSnapshot={handleDeleteSnapshot}
          onRestoreDefaults={handleRestoreDefaults}
          currentDemo={activeDemo}
          currentConfig={getCurrentConfig()}
        />
      </div>
    </div>
  );
};

export default QuantumDemo; 