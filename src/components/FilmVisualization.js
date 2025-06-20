import React from 'react';
import WaveVisualizer from './WaveVisualizer';
import SphereVisualizer from './SphereVisualizer';

const FilmVisualization = ({ 
  demo, 
  isPlaying, 
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
  // Map demos to animation types
  const getAnimationType = (demoType) => {
    switch (demoType) {
      case 'puncture': 
        return 'puncture';   // Button 1: Puncture effect with downward bulge
      case 'flexibility': 
        return 'wave';       // Button 2: Original undulating wave
      case 'stretch': 
        return 'stretch';    // Button 3: Stretch/contract in plane
      case 'cling': 
        return 'sphere';     // Button 4: Spherical (handled by SphereVisualizer)
      case 'retention': 
        return 'cube';       // Button 5: Static cube
      case 'stability': 
        return 'icosahedron'; // Button 6: Pulsating icosahedron
      case 'organic': 
        return 'oblate'; // Button 7: Organic oblate spheroid
      case 'fibonacci_sphere': 
        return 'fibonacci_sphere'; // Button 8: Fibonacci sphere
      case 'fibonacci_disc': 
        return 'fibonacci_disc'; // Button 9: Fibonacci disc
      case 'biconvex_disc':
        return 'biconvex_disc'; // Button 10: Biconvex disc
      case 'biconcave_disc':
        return 'biconcave_disc'; // Button 11: Biconcave disc
      case 'torus':
        return 'torus'; // Button 12: Torus
              case 'parametric_spiral_1':
          return 'parametric_spiral_1'; // Button 13: Parametric spiral A
        case 'parametric_spiral_2':
          return 'parametric_spiral_2'; // Button 14: Parametric spiral B
        case 'multi_sphere_25':
          return 'multi_sphere_25'; // Button 15: Multi-sphere with 1/25th size inner spheres
        case 'multi_sphere_10':
          return 'multi_sphere_10'; // Button 16: Multi-sphere with 1/10th size inner spheres
        case 'torus_5_sided':
          return 'torus_5_sided'; // Button 17: 5-sided torus
        case 'lines_sphere':
          return 'lines_sphere'; // Button 18: AlteredQualia lines sphere classic
      default: 
        return 'wave';
    }
  };

  const animationType = getAnimationType(demo);

  return (
    <group position={[0, 0, 0]}>
      {/* Use different visualizers based on demo type */}
      {demo === 'cling' ? (
        <SphereVisualizer 
          isActive={isPlaying}
          undulationSpeed={undulationSpeed}
          colorTransition1={colorTransition1}
          colorTransition2={colorTransition2}
          colorTransition3={colorTransition3}
        />
      ) : (
        <WaveVisualizer 
          isActive={isPlaying}
          animationType={animationType}
          undulationSpeed={undulationSpeed}
          fibonacciDensity={fibonacciDensity}
          density={density}
          rotationSpeed={rotationSpeed}
          lineLength={lineLength}
          colorTransition1={colorTransition1}
          colorTransition2={colorTransition2}
          colorTransition3={colorTransition3}
          spiralParams={spiralParams}
        />
      )}
      
      {/* Minimal environmental lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.3} color="#d3b166" />
    </group>
  );
};

export default FilmVisualization; 