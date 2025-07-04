import React from 'react';
import { motion } from 'framer-motion';

const DemoIcon = ({ type, isActive }) => {
  const iconProps = {
    width: "24",
    height: "24",
    fill: "none",
    stroke: isActive ? "#d3b166" : "#ecffff",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };

  switch (type) {
    case 'wave':
      return (
        <svg {...iconProps} viewBox="0 0 26 10">
          <path d="M0 1C8.21053 1 13.2281 8 13.2281 8C13.2281 8 17.7895 1 26 1" strokeDasharray="1.13 0.57" />
        </svg>
      );
    case 'line':
      return (
        <svg {...iconProps} viewBox="0 0 22 2">
          <path d="M0 1C0 1 3.85965 1 11.193 1C18.5263 1 22 1 22 1" strokeDasharray="1 0.5" />
        </svg>
      );
    case 'square':
      return (
        <svg {...iconProps} viewBox="0 0 18 18">
          <rect x="1" y="1" width="16" height="16" strokeDasharray="1 0.5" />
        </svg>
      );
    case 'circle':
      return (
        <svg {...iconProps} viewBox="0 0 22 22">
          <rect x="1" y="1" width="20" height="20" rx="9" strokeDasharray="1 0.5" />
        </svg>
      );
    case 'triangle':
      return (
        <svg {...iconProps} viewBox="0 0 20 18">
          <path d="M10 1L19 17H1L10 1Z" strokeDasharray="1 0.5" />
        </svg>
      );
    case 'oval':
      return (
        <svg {...iconProps} viewBox="0 0 24 16">
          <ellipse cx="12" cy="8" rx="11" ry="7" strokeDasharray="1 0.5" />
        </svg>
      );
    case 'diamond':
      return (
        <svg {...iconProps} viewBox="0 0 18 18">
          <path d="M9 1L17 9L9 17L1 9L9 1Z" strokeDasharray="1 0.5" />
        </svg>
      );
    case 'disc':
      return (
        <svg {...iconProps} viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="9" strokeDasharray="1 0.5" />
          <circle cx="10" cy="10" r="5" strokeDasharray="1 0.5" />
          <circle cx="10" cy="10" r="1" strokeDasharray="1 0.5" />
        </svg>
      );
    case 'biconvex':
      return (
        <svg {...iconProps} viewBox="0 0 20 20">
          <path d="M2 10 Q10 6 18 10 Q10 14 2 10" strokeDasharray="1 0.5" />
          <path d="M2 10 Q10 14 18 10 Q10 6 2 10" strokeDasharray="1 0.5" />
        </svg>
      );
    case 'biconcave':
      return (
        <svg {...iconProps} viewBox="0 0 20 20">
          <path d="M2 10 Q10 12 18 10 Q10 8 2 10" strokeDasharray="1 0.5" />
          <path d="M2 10 Q10 8 18 10 Q10 12 2 10" strokeDasharray="1 0.5" />
        </svg>
      );
    case 'torus':
      return (
        <svg {...iconProps} viewBox="0 0 20 20">
          <ellipse cx="10" cy="10" rx="8" ry="4" strokeDasharray="1 0.5" />
          <ellipse cx="10" cy="10" rx="4" ry="2" strokeDasharray="1 0.5" />
        </svg>
      );
    case 'spiral':
      return (
        <svg {...iconProps} viewBox="0 0 20 20">
          <path d="M10 10 Q12 8 14 10 Q12 12 10 10 Q8 8 6 10 Q8 12 10 10" strokeDasharray="1 0.5" />
        </svg>
      );
    case 'spiral2':
      return (
        <svg {...iconProps} viewBox="0 0 20 20">
          <path d="M10 2 Q16 6 14 10 Q8 14 6 10 Q4 6 10 8 Q14 10 12 12" strokeDasharray="1 0.5" />
        </svg>
      );
    case 'lines-sphere':
      return (
        <svg {...iconProps} viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" fill="none" strokeDasharray="1 0.5" />
          <g strokeDasharray="none">
            <line x1="10" y1="2" x2="10" y2="5" />
            <line x1="10" y1="15" x2="10" y2="18" />
            <line x1="2" y1="10" x2="5" y2="10" />
            <line x1="15" y1="10" x2="18" y2="10" />
            <line x1="4.3" y1="4.3" x2="6.1" y2="6.1" />
            <line x1="13.9" y1="13.9" x2="15.7" y2="15.7" />
            <line x1="15.7" y1="4.3" x2="13.9" y2="6.1" />
            <line x1="6.1" y1="13.9" x2="4.3" y2="15.7" />
          </g>
        </svg>
      );
    case 'atom':
      return (
        <svg {...iconProps} viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="2" fill={isActive ? "#d3b166" : "#ecffff"} strokeDasharray="none" />
          <ellipse cx="10" cy="10" rx="8" ry="3" strokeDasharray="1 0.5" transform="rotate(0 10 10)" />
          <ellipse cx="10" cy="10" rx="8" ry="3" strokeDasharray="1 0.5" transform="rotate(60 10 10)" />
          <ellipse cx="10" cy="10" rx="8" ry="3" strokeDasharray="1 0.5" transform="rotate(120 10 10)" />
          <circle cx="6" cy="6" r="1" fill={isActive ? "#d3b166" : "#ecffff"} strokeDasharray="none" />
          <circle cx="14" cy="14" r="1" fill={isActive ? "#d3b166" : "#ecffff"} strokeDasharray="none" />
          <circle cx="14" cy="6" r="1" fill={isActive ? "#d3b166" : "#ecffff"} strokeDasharray="none" />
        </svg>
      );
    case 'pentagon-torus':
      return (
        <svg {...iconProps} viewBox="0 0 20 20">
          <path d="M10 2 L16 6 L14 14 L6 14 L4 6 Z" strokeDasharray="1 0.5" fill="none" />
          <path d="M10 6 L13 8.5 L12 12.5 L8 12.5 L7 8.5 Z" strokeDasharray="1 0.5" fill="none" />
        </svg>
      );
    case 'jellyfish':
      return (
        <svg {...iconProps} viewBox="0 0 20 20">
          {/* Jellyfish bell */}
          <path d="M4 8 Q10 4 16 8 Q16 12 10 14 Q4 12 4 8" strokeDasharray="1 0.5" fill="none" />
          {/* Tentacles */}
          <path d="M6 12 Q6 16 5 18" strokeDasharray="none" strokeWidth="1.5" />
          <path d="M8 13 Q8 17 7 19" strokeDasharray="none" strokeWidth="1.5" />
          <path d="M10 14 Q10 18 9 20" strokeDasharray="none" strokeWidth="1.5" />
          <path d="M12 13 Q12 17 13 19" strokeDasharray="none" strokeWidth="1.5" />
          <path d="M14 12 Q14 16 15 18" strokeDasharray="none" strokeWidth="1.5" />
          {/* Bell details */}
          <path d="M6 8 Q10 10 14 8" strokeDasharray="0.5 0.5" strokeWidth="1" opacity="0.7" />
        </svg>
      );
    case 'halo':
      return (
        <svg {...iconProps} viewBox="0 0 20 20">
          {/* Main halo ring */}
          <circle cx="10" cy="10" r="7" strokeDasharray="1 0.5" fill="none" strokeWidth="2" />
          <circle cx="10" cy="10" r="5" strokeDasharray="1 0.5" fill="none" strokeWidth="1.5" />
          {/* Small rings scattered around */}
          <circle cx="6" cy="6" r="1" strokeDasharray="none" fill="none" strokeWidth="1" />
          <circle cx="14" cy="7" r="0.8" strokeDasharray="none" fill="none" strokeWidth="1" />
          <circle cx="15" cy="13" r="1.2" strokeDasharray="none" fill="none" strokeWidth="1" />
          <circle cx="5" cy="14" r="0.9" strokeDasharray="none" fill="none" strokeWidth="1" />
          <circle cx="8" cy="4" r="0.7" strokeDasharray="none" fill="none" strokeWidth="1" />
          <circle cx="12" cy="16" r="1.1" strokeDasharray="none" fill="none" strokeWidth="1" />
        </svg>
      );
    case 'eclipse':
      return (
        <svg {...iconProps} viewBox="0 0 20 20">
          {/* Sun corona rays */}
          <g strokeDasharray="none" strokeWidth="1" opacity="0.7">
            <line x1="10" y1="1" x2="10" y2="3" />
            <line x1="10" y1="17" x2="10" y2="19" />
            <line x1="1" y1="10" x2="3" y2="10" />
            <line x1="17" y1="10" x2="19" y2="10" />
            <line x1="3.5" y1="3.5" x2="4.9" y2="4.9" />
            <line x1="15.1" y1="15.1" x2="16.5" y2="16.5" />
            <line x1="16.5" y1="3.5" x2="15.1" y2="4.9" />
            <line x1="4.9" y1="15.1" x2="3.5" y2="16.5" />
          </g>
          {/* Sun outline (partially visible) */}
          <circle cx="10" cy="10" r="6" strokeDasharray="1 0.5" fill="none" strokeWidth="1.5" opacity="0.6" />
          {/* Moon (black disc covering most of sun) */}
          <circle cx="10" cy="10" r="5.5" fill={isActive ? "#d3b166" : "#ecffff"} stroke="none" />
          {/* Thin corona outline */}
          <circle cx="10" cy="10" r="5.8" strokeDasharray="none" fill="none" strokeWidth="0.8" opacity="0.9" />
        </svg>
      );
    case 'immune':
      return (
        <svg {...iconProps} viewBox="0 0 20 20">
          {/* Central immune cell cluster */}
          <circle cx="10" cy="10" r="3" strokeDasharray="1 0.5" fill="none" strokeWidth="1.5" />
          {/* Surrounding immune cells */}
          <circle cx="6" cy="6" r="1.5" strokeDasharray="none" fill="none" strokeWidth="1" opacity="0.8" />
          <circle cx="14" cy="6" r="1.2" strokeDasharray="none" fill="none" strokeWidth="1" opacity="0.8" />
          <circle cx="16" cy="10" r="1.3" strokeDasharray="none" fill="none" strokeWidth="1" opacity="0.8" />
          <circle cx="14" cy="14" r="1.4" strokeDasharray="none" fill="none" strokeWidth="1" opacity="0.8" />
          <circle cx="6" cy="14" r="1.1" strokeDasharray="none" fill="none" strokeWidth="1" opacity="0.8" />
          <circle cx="4" cy="10" r="1.2" strokeDasharray="none" fill="none" strokeWidth="1" opacity="0.8" />
          {/* Connection lines showing interactions */}
          <line x1="10" y1="7" x2="6" y2="6" strokeDasharray="0.5 0.5" strokeWidth="0.8" opacity="0.5" />
          <line x1="13" y1="10" x2="16" y2="10" strokeDasharray="0.5 0.5" strokeWidth="0.8" opacity="0.5" />
          <line x1="10" y1="13" x2="6" y2="14" strokeDasharray="0.5 0.5" strokeWidth="0.8" opacity="0.5" />
          {/* Activity indicators */}
          <circle cx="8" cy="4" r="0.5" fill={isActive ? "#00ff88" : "#ecffff"} stroke="none" opacity="0.9" />
          <circle cx="12" cy="4" r="0.4" fill={isActive ? "#00ff88" : "#ecffff"} stroke="none" opacity="0.7" />
          <circle cx="16" cy="8" r="0.6" fill={isActive ? "#00ff88" : "#ecffff"} stroke="none" opacity="0.8" />
          <circle cx="16" cy="12" r="0.3" fill={isActive ? "#00ff88" : "#ecffff"} stroke="none" opacity="0.6" />
          <circle cx="8" cy="16" r="0.5" fill={isActive ? "#00ff88" : "#ecffff"} stroke="none" opacity="0.8" />
          <circle cx="4" cy="12" r="0.4" fill={isActive ? "#00ff88" : "#ecffff"} stroke="none" opacity="0.7" />
        </svg>
      );
    case 'sphere-lines':
      return (
        <svg {...iconProps} viewBox="0 0 20 20">
          {/* Outer sphere circle */}
          <circle cx="10" cy="10" r="8" fill="none" strokeDasharray="1 0.5" />
          {/* Latitude lines (horizontal) */}
          <ellipse cx="10" cy="10" rx="8" ry="2" fill="none" strokeDasharray="none" strokeWidth="1" />
          <ellipse cx="10" cy="10" rx="6" ry="1.5" fill="none" strokeDasharray="none" strokeWidth="1" />
          <ellipse cx="10" cy="10" rx="4" ry="1" fill="none" strokeDasharray="none" strokeWidth="1" />
          {/* Longitude lines (vertical) */}
          <ellipse cx="10" cy="10" rx="2" ry="8" fill="none" strokeDasharray="none" strokeWidth="1" />
          <ellipse cx="10" cy="10" rx="1.5" ry="6" fill="none" strokeDasharray="none" strokeWidth="1" />
          <ellipse cx="10" cy="10" rx="1" ry="4" fill="none" strokeDasharray="none" strokeWidth="1" />
          {/* Center lines */}
          <line x1="2" y1="10" x2="18" y2="10" strokeDasharray="none" strokeWidth="1" />
          <line x1="10" y1="2" x2="10" y2="18" strokeDasharray="none" strokeWidth="1" />
        </svg>
      );
    default:
      return null;
  }
};

const DemoControls = ({ 
  demos, 
  activeDemo, 
  onDemoChange,
  fibonacciDensity = 1.0,
  onFibonacciDensityChange,
  density = 1.0,
  onDensityChange,
  rotationSpeed = 1.0,
  onRotationSpeedChange,
  lineLength = 1.0,
  onLineLengthChange,
  colorTransition1 = 0.5,
  colorTransition2 = 0.5, 
  colorTransition3 = 0.5,
  onColorTransition1Change,
  onColorTransition2Change,
  onColorTransition3Change,
  spiralParams = {},
  onSpiralParamsChange,
  latitudeLines = 10,
  onLatitudeLinesChange,
  longitudeLines = 16,
  onLongitudeLinesChange
}) => {
  return (
    <div className="demo-controls" style={{ margin: 0, padding: 0, minHeight: '500px', color: 'white' }}>
      <h3 style={{ color: '#ffcc44', margin: '0 0 10px 0' }}>Demo Controls</h3>
      <div 
        className="demo-navigation" 
        style={{ 
          marginTop: 0, 
          paddingTop: 0,
          height: 'calc(100vh - 280px)', // Container height minus margins, title, and advanced controls space
          maxHeight: 'calc(100vh - 280px)',
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingRight: '8px',
          // Custom scrollbar styling
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(211, 177, 102, 0.5) rgba(0, 0, 0, 0.1)'
        }}
      >
        {demos.map((demo, index) => (
          <motion.div
            key={demo.id}
            className={`demo-nav-item ${activeDemo === demo.id ? 'active' : ''}`}
            onClick={() => onDemoChange(demo.id)}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <DemoIcon type={demo.icon} isActive={activeDemo === demo.id} />
            <span className="demo-title">{demo.title}</span>
          </motion.div>
        ))}
      </div>

      {/* Advanced Controls */}
      <motion.div 
        className="advanced-controls"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: 'rgba(211, 177, 102, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(211, 177, 102, 0.3)'
        }}
      >
        {/* Fibonacci Density Control - Show for Fibonacci and new geometric demos */}
        {(activeDemo === 'fibonacci_sphere' || activeDemo === 'fibonacci_disc' || 
          activeDemo === 'biconvex_disc' || activeDemo === 'biconcave_disc' || activeDemo === 'torus' ||
          activeDemo === 'multi_sphere_25' || activeDemo === 'multi_sphere_10' || activeDemo === 'torus_5_sided') && (
          <div className="control-group" style={{ marginBottom: '15px' }}>
            <label style={{ 
              color: '#d3b166', 
              fontSize: '0.9rem', 
              marginBottom: '8px', 
              display: 'block' 
            }}>
              Fibonacci Density: {fibonacciDensity.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={fibonacciDensity}
              onChange={(e) => onFibonacciDensityChange && onFibonacciDensityChange(parseFloat(e.target.value))}
              style={{
                width: '100%',
                height: '4px',
                background: 'linear-gradient(to right, #fcb900, #ff6900)',
                borderRadius: '2px',
                outline: 'none',
                appearance: 'none'
              }}
            />
          </div>
        )}

        {/* General Density Control - Show for non-Fibonacci demos that use density */}
        {(activeDemo === 'organic' || activeDemo === 'parametric_spiral_1' || activeDemo === 'parametric_spiral_2' || activeDemo === 'lines_sphere' || activeDemo === 'jellyfish_medusae' || activeDemo === 'rainbow_halo') && (
          <div className="control-group" style={{ marginBottom: '15px' }}>
            <label style={{ 
              color: '#d3b166', 
              fontSize: '0.9rem', 
              marginBottom: '8px', 
              display: 'block' 
            }}>
              Particle Density: {density.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={density}
              onChange={(e) => onDensityChange && onDensityChange(parseFloat(e.target.value))}
              style={{
                width: '100%',
                height: '4px',
                background: 'linear-gradient(to right, #9b59b6, #3498db)',
                borderRadius: '2px',
                outline: 'none',
                appearance: 'none'
              }}
            />
          </div>
        )}

        {/* Rotation Speed Control - Show for lines_sphere demo */}
        {activeDemo === 'lines_sphere' && (
          <div className="control-group" style={{ marginBottom: '15px' }}>
            <label style={{ 
              color: '#d3b166', 
              fontSize: '0.9rem', 
              marginBottom: '8px', 
              display: 'block' 
            }}>
              Rotation Speed: {rotationSpeed.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.0"
              max="3.0"
              step="0.1"
              value={rotationSpeed}
              onChange={(e) => onRotationSpeedChange && onRotationSpeedChange(parseFloat(e.target.value))}
              style={{
                width: '100%',
                height: '4px',
                background: 'linear-gradient(to right, #e74c3c, #f39c12, #2ecc71)',
                borderRadius: '2px',
                outline: 'none',
                appearance: 'none'
              }}
            />
          </div>
        )}

        {/* Line Length Control - Show for lines_sphere demo */}
        {activeDemo === 'lines_sphere' && (
          <div className="control-group" style={{ marginBottom: '15px' }}>
            <label style={{ 
              color: '#d3b166', 
              fontSize: '0.9rem', 
              marginBottom: '8px', 
              display: 'block' 
            }}>
              Line Length: {lineLength.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={lineLength}
              onChange={(e) => onLineLengthChange && onLineLengthChange(parseFloat(e.target.value))}
              style={{
                width: '100%',
                height: '4px',
                background: 'linear-gradient(to right, #3498db, #9b59b6, #e74c3c)',
                borderRadius: '2px',
                outline: 'none',
                appearance: 'none'
              }}
            />
          </div>
        )}

        {/* Latitude Lines Control - Show for sphere_lines demo */}
        {activeDemo === 'sphere_lines' && (
          <div className="control-group" style={{ marginBottom: '15px' }}>
            <label style={{ 
              color: '#d3b166', 
              fontSize: '0.9rem', 
              marginBottom: '8px', 
              display: 'block' 
            }}>
              Latitude Lines (L1): {latitudeLines}
            </label>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={latitudeLines}
              onChange={(e) => onLatitudeLinesChange && onLatitudeLinesChange(parseInt(e.target.value))}
              style={{
                width: '100%',
                height: '4px',
                background: 'linear-gradient(to right, #2ecc71, #3498db, #9b59b6)',
                borderRadius: '2px',
                outline: 'none',
                appearance: 'none'
              }}
            />
          </div>
        )}

        {/* Longitude Lines Control - Show for sphere_lines demo */}
        {activeDemo === 'sphere_lines' && (
          <div className="control-group" style={{ marginBottom: '15px' }}>
            <label style={{ 
              color: '#d3b166', 
              fontSize: '0.9rem', 
              marginBottom: '8px', 
              display: 'block' 
            }}>
              Longitude Lines (L2): {longitudeLines}
            </label>
            <input
              type="range"
              min="3"
              max="50"
              step="1"
              value={longitudeLines}
              onChange={(e) => onLongitudeLinesChange && onLongitudeLinesChange(parseInt(e.target.value))}
              style={{
                width: '100%',
                height: '4px',
                background: 'linear-gradient(to right, #e74c3c, #f39c12, #f1c40f)',
                borderRadius: '2px',
                outline: 'none',
                appearance: 'none'
              }}
            />
          </div>
        )}

        {/* Spirograph Parameter Controls - Show for spirograph demos */}
        {(activeDemo === 'parametric_spiral_1' || activeDemo === 'parametric_spiral_2') && (
          <div className="spiral-controls" style={{ marginTop: '15px' }}>
            <h4 style={{ 
              color: '#d3b166', 
              fontSize: '0.9rem', 
              marginBottom: '10px',
              fontWeight: 'normal'
            }}>
              Spirograph Parameters ({activeDemo === 'parametric_spiral_1' ? 'Hypocycloid' : 'Epicycloid'})
            </h4>
            
            {(() => {
              const spiralKey = activeDemo === 'parametric_spiral_1' ? 'spiral1' : 'spiral2';
              const params = spiralParams[spiralKey] || {};
              
              const updateParam = (key, value) => {
                if (onSpiralParamsChange) {
                  onSpiralParamsChange({
                    ...spiralParams,
                    [spiralKey]: { ...params, [key]: value }
                  });
                }
              };
              
              return (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="control-group">
                      <label style={{ color: '#ecffff', fontSize: '0.7rem', marginBottom: '3px', display: 'block' }}>
                        Fixed Circle (R):
                      </label>
                      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <input
                          type="range" min="1" max="500" step="1" 
                          value={params.R || (activeDemo === 'parametric_spiral_1' ? 120 : 80)}
                          onChange={(e) => updateParam('R', parseInt(e.target.value))}
                          style={{ width: '60%', height: '2px', background: '#d3b166' }}
                        />
                        <input
                          type="number"
                          min="1"
                          max="500"
                          step="1"
                          value={params.R || (activeDemo === 'parametric_spiral_1' ? 120 : 80)}
                          onChange={(e) => updateParam('R', parseInt(e.target.value) || 1)}
                          style={{
                            width: '40%',
                            padding: '3px 6px',
                            fontSize: '0.75rem',
                            background: 'rgba(0,0,0,0.5)',
                            border: '1px solid #d3b166',
                            borderRadius: '3px',
                            color: '#ecffff',
                            minWidth: '45px'
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="control-group">
                      <label style={{ color: '#ecffff', fontSize: '0.7rem', marginBottom: '3px', display: 'block' }}>
                        Rolling Circle (r):
                      </label>
                      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <input
                          type="range" min="1" max="200" step="1" 
                          value={params.r || (activeDemo === 'parametric_spiral_1' ? 30 : 25)}
                          onChange={(e) => updateParam('r', parseInt(e.target.value))}
                          style={{ width: '60%', height: '2px', background: '#d3b166' }}
                        />
                        <input
                          type="number"
                          min="1"
                          max="200"
                          step="1"
                          value={params.r || (activeDemo === 'parametric_spiral_1' ? 30 : 25)}
                          onChange={(e) => updateParam('r', parseInt(e.target.value) || 1)}
                          style={{
                            width: '40%',
                            padding: '3px 6px',
                            fontSize: '0.75rem',
                            background: 'rgba(0,0,0,0.5)',
                            border: '1px solid #d3b166',
                            borderRadius: '3px',
                            color: '#ecffff',
                            minWidth: '45px'
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="control-group">
                      <label style={{ color: '#ecffff', fontSize: '0.7rem', marginBottom: '3px', display: 'block' }}>
                        Pen Distance (d):
                      </label>
                      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <input
                          type="range" min="1" max="300" step="1" 
                          value={params.d || (activeDemo === 'parametric_spiral_1' ? 50 : 40)}
                          onChange={(e) => updateParam('d', parseInt(e.target.value))}
                          style={{ width: '60%', height: '2px', background: '#d3b166' }}
                        />
                        <input
                          type="number"
                          min="1"
                          max="300"
                          step="1"
                          value={params.d || (activeDemo === 'parametric_spiral_1' ? 50 : 40)}
                          onChange={(e) => updateParam('d', parseInt(e.target.value) || 1)}
                          style={{
                            width: '40%',
                            padding: '3px 6px',
                            fontSize: '0.75rem',
                            background: 'rgba(0,0,0,0.5)',
                            border: '1px solid #d3b166',
                            borderRadius: '3px',
                            color: '#ecffff',
                            minWidth: '45px'
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="control-group">
                      <label style={{ color: '#ecffff', fontSize: '0.7rem', marginBottom: '3px', display: 'block' }}>
                        Rotations:
                      </label>
                      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <input
                          type="range" min="1" max="100" step="1" 
                          value={params.rotations || (activeDemo === 'parametric_spiral_1' ? 8 : 6)}
                          onChange={(e) => updateParam('rotations', parseInt(e.target.value))}
                          style={{ width: '60%', height: '2px', background: '#d3b166' }}
                        />
                        <input
                          type="number"
                          min="1"
                          max="100"
                          step="1"
                          value={params.rotations || (activeDemo === 'parametric_spiral_1' ? 8 : 6)}
                          onChange={(e) => updateParam('rotations', parseInt(e.target.value) || 1)}
                          style={{
                            width: '40%',
                            padding: '3px 6px',
                            fontSize: '0.75rem',
                            background: 'rgba(0,0,0,0.5)',
                            border: '1px solid #d3b166',
                            borderRadius: '3px',
                            color: '#ecffff',
                            minWidth: '45px'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DemoControls; 