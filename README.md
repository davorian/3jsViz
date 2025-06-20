# Quantum Interactive Demo

A React-based interactive demonstration of Quantum Stretch Film technology featuring 3D visualizations and immersive user experience.

## Features

- **Interactive 3D Visualizations**: Experience the four key properties of Quantum film through real-time 3D animations
- **Puncture Resistance Demo**: Watch stress visualization and impact resistance testing
- **Stretch Test Demo**: See the film's elasticity and stretching capabilities
- **Cling Increase Demo**: Observe adhesion properties with surface interaction
- **Retention Demo**: Experience long-term holding power visualization
- **Audio-Visual Experience**: Wave visualizers and smooth animations
- **Responsive Design**: Optimized for desktop and mobile devices

## Technology Stack

- **React 18** - Frontend framework
- **React Three Fiber** - 3D rendering with Three.js
- **React Three Drei** - 3D helpers and utilities
- **Framer Motion** - Smooth animations and transitions
- **Three.js** - 3D graphics library
- **GSAP** - Advanced animations (ready for integration)

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd quantum-interactive-demo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:3000
   ```

## Usage

### Interactive Controls

- **Navigation Panel**: Click on any of the four demo options:
  - Puncture Resistance (wave icon)
  - Stretch Up (line icon)
  - Cling Increase (circle icon)
  - Retention (square icon)

- **Play Controls**: Use the play/pause button to start/stop animations
- **3D Scene**: 
  - Mouse drag to rotate the view
  - Scroll to zoom in/out
  - Each demo shows different 3D visualizations

### Demo Descriptions

#### Puncture Resistance
- Visualizes film's ability to withstand sharp objects
- Shows stress distribution with particle effects
- Demonstrates impact resistance with dynamic animations

#### Stretch Up
- Shows film elasticity and stretching capabilities
- Demonstrates material conservation through visual scaling
- Includes stretch indicators for measurement reference

#### Cling Increase
- Displays adhesion properties with surface interaction
- Shows undulating surface effects when active
- Demonstrates secure attachment capabilities

#### Retention
- Visualizes long-term holding power
- Shows wrapped objects with retention bands
- Demonstrates stability over time with subtle animations

## Project Structure

```
src/
├── components/
│   ├── QuantumDemo.js          # Main demo orchestrator
│   ├── FilmVisualization.js    # 3D film visualizations
│   ├── DemoControls.js         # Navigation and play controls
│   ├── DemoInfo.js            # Information panel
│   └── WaveVisualizer.js      # Audio wave visualization
├── App.js                     # Main application component
├── App.css                    # Global styles and theming
└── index.js                   # Application entry point
```

## Customization

### Adding New Demos

1. **Update demo data** in `QuantumDemo.js`:
   ```javascript
   const demoData = {
     newDemo: {
       id: 'newDemo',
       title: 'New Demo Title',
       description: 'Demo description...',
       icon: 'iconType',
       color: '#d3b166',
       animation: 'newAnimation'
     }
   };
   ```

2. **Add visualization** in `FilmVisualization.js`:
   ```javascript
   case 'newDemo':
     // Add your 3D visualization logic
     return <YourNewVisualization />;
   ```

3. **Update icon types** in `DemoControls.js` if needed

### Styling Customization

The design follows the original Quantum brand guidelines:
- **Primary Background**: `#011317` (dark blue-green)
- **Secondary Background**: `#02161a` (slightly lighter)
- **Accent Color**: `#d3b166` (gold)
- **Text Color**: `#ecffff` (light cyan)

Modify `App.css` to customize colors, spacing, and animations.

### Performance Optimization

- 3D scenes are optimized for 60fps performance
- Animations use `requestAnimationFrame` for smooth rendering
- Particle systems are limited to maintain performance
- Responsive design reduces complexity on mobile devices

## Browser Support

- **Chrome 88+** (recommended)
- **Firefox 85+**
- **Safari 14+**
- **Edge 88+**

WebGL support is required for 3D visualizations.

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Building for Production

```bash
npm run build
```

This creates an optimized build in the `build/` directory ready for deployment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is created for demonstration purposes based on the Quantum Stretch Film website.

## Acknowledgments

- Original design inspired by quantumstretch.com
- 3D visualizations powered by Three.js and React Three Fiber
- Animations enhanced with Framer Motion
- Icons and graphics adapted from the original Quantum brand assets
