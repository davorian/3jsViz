import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SnapshotManager = ({ 
  snapshots, 
  onSaveSnapshot, 
  onLoadSnapshot, 
  onDeleteSnapshot, 
  onRestoreDefaults,
  currentDemo,
  currentConfig
}) => {
  const handleSaveSnapshot = () => {
    if (snapshots.length >= 20) {
      alert('Maximum 20 snapshots allowed. Please delete some to add new ones.');
      return;
    }
    
    // Count existing snapshots of the same demo type
    const sameTypeCount = snapshots.filter(s => s.demo === currentDemo).length;
    const demoNumber = sameTypeCount + 1;
    
    const snapshot = {
      id: Date.now(),
      demo: currentDemo,
      config: { ...currentConfig },
      timestamp: new Date().toLocaleTimeString(),
      name: `${currentDemo} #${demoNumber} - ${new Date().toLocaleTimeString()}`
    };
    
    onSaveSnapshot(snapshot);
  };

  const getDemoIcon = (demoType) => {
    const iconProps = {
      width: "16",
      height: "16",
      fill: "none",
      stroke: "#d3b166",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    };

    switch (demoType) {
      case 'puncture':
        return (
          <svg {...iconProps} viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8" strokeDasharray="1 0.5" />
            <circle cx="10" cy="10" r="3" fill="#d3b166" />
          </svg>
        );
      case 'wave':
        return (
          <svg {...iconProps} viewBox="0 0 26 10">
            <path d="M0 1C8.21053 1 13.2281 8 13.2281 8C13.2281 8 17.7895 1 26 1" strokeDasharray="1 0.5" />
          </svg>
        );
      case 'stretch':
        return (
          <svg {...iconProps} viewBox="0 0 22 2">
            <path d="M0 1C0 1 3.85965 1 11.193 1C18.5263 1 22 1 22 1" strokeDasharray="1 0.5" />
          </svg>
        );
      case 'sphere':
        return (
          <svg {...iconProps} viewBox="0 0 22 22">
            <rect x="1" y="1" width="20" height="20" rx="9" strokeDasharray="1 0.5" />
          </svg>
        );
      case 'cube':
        return (
          <svg {...iconProps} viewBox="0 0 18 18">
            <rect x="1" y="1" width="16" height="16" strokeDasharray="1 0.5" />
          </svg>
        );
      case 'icosahedron':
        return (
          <svg {...iconProps} viewBox="0 0 20 18">
            <path d="M10 1L19 17H1L10 1Z" strokeDasharray="1 0.5" />
          </svg>
        );
      case 'oblate':
        return (
          <svg {...iconProps} viewBox="0 0 24 16">
            <ellipse cx="12" cy="8" rx="11" ry="7" strokeDasharray="1 0.5" />
          </svg>
        );
      case 'fibonacci_sphere':
        return (
          <svg {...iconProps} viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="9" strokeDasharray="1 0.5" />
            <circle cx="10" cy="10" r="5" strokeDasharray="1 0.5" />
          </svg>
        );
      case 'fibonacci_disc':
        return (
          <svg {...iconProps} viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="9" strokeDasharray="1 0.5" />
            <circle cx="10" cy="10" r="5" strokeDasharray="1 0.5" />
            <circle cx="10" cy="10" r="1" strokeDasharray="1 0.5" />
          </svg>
        );
      case 'biconvex_disc':
        return (
          <svg {...iconProps} viewBox="0 0 20 20">
            <path d="M2 10 Q10 6 18 10 Q10 14 2 10" strokeDasharray="1 0.5" />
            <path d="M2 10 Q10 14 18 10 Q10 6 2 10" strokeDasharray="1 0.5" />
          </svg>
        );
      case 'biconcave_disc':
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
      case 'parametric_spiral_1':
        return (
          <svg {...iconProps} viewBox="0 0 20 20">
            <path d="M10 10 Q12 8 14 10 Q12 12 10 10 Q8 8 6 10 Q8 12 10 10" strokeDasharray="1 0.5" />
          </svg>
        );
      case 'parametric_spiral_2':
        return (
          <svg {...iconProps} viewBox="0 0 20 20">
            <path d="M10 2 Q16 6 14 10 Q8 14 6 10 Q4 6 10 8 Q14 10 12 12" strokeDasharray="1 0.5" />
          </svg>
        );
      case 'multi_sphere_25':
        return (
          <svg {...iconProps} viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="9" strokeDasharray="1 0.5" />
            <circle cx="6" cy="6" r="1" strokeDasharray="1 0.5" />
            <circle cx="14" cy="6" r="1" strokeDasharray="1 0.5" />
            <circle cx="6" cy="14" r="1" strokeDasharray="1 0.5" />
            <circle cx="14" cy="14" r="1" strokeDasharray="1 0.5" />
            <circle cx="10" cy="10" r="1" strokeDasharray="1 0.5" />
          </svg>
        );
      case 'multi_sphere_10':
        return (
          <svg {...iconProps} viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="9" strokeDasharray="1 0.5" />
            <circle cx="7" cy="7" r="1.5" strokeDasharray="1 0.5" />
            <circle cx="13" cy="7" r="1.5" strokeDasharray="1 0.5" />
            <circle cx="7" cy="13" r="1.5" strokeDasharray="1 0.5" />
            <circle cx="13" cy="13" r="1.5" strokeDasharray="1 0.5" />
            <circle cx="10" cy="10" r="1.5" strokeDasharray="1 0.5" />
          </svg>
        );
      case 'torus_5_sided':
        return (
          <svg {...iconProps} viewBox="0 0 20 20">
            <polygon cx="10" cy="10" points="10,2 16,7 13,14 7,14 4,7" strokeDasharray="1 0.5" fill="none" />
            <polygon cx="10" cy="10" points="10,6 13,8 12,12 8,12 7,8" strokeDasharray="1 0.5" fill="none" />
          </svg>
        );
      case 'lines_sphere':
        return (
          <svg {...iconProps} viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8" strokeDasharray="1 0.5" />
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
      default:
        return (
          <svg {...iconProps} viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8" strokeDasharray="1 0.5" />
          </svg>
        );
    }
  };

  const getConfigSummary = (config) => {
    const parts = [];
    if (config.undulationSpeed !== undefined) parts.push(`Speed: ${config.undulationSpeed.toFixed(1)}`);
    if (config.fibonacciDensity !== undefined && config.fibonacciDensity !== 1.0) parts.push(`Fib Density: ${config.fibonacciDensity.toFixed(1)}`);
    if (config.density !== undefined && config.density !== 1.0) parts.push(`Density: ${config.density.toFixed(1)}`);
    if (config.rotationSpeed !== undefined && config.rotationSpeed !== 1.0) parts.push(`Rotation: ${config.rotationSpeed.toFixed(1)}x`);
    if (config.lineLength !== undefined && config.lineLength !== 1.0) parts.push(`Line Length: ${config.lineLength.toFixed(1)}x`);
    if (config.spiralParams && (config.demo === 'parametric_spiral_1' || config.demo === 'parametric_spiral_2')) {
      const spiralKey = config.demo === 'parametric_spiral_1' ? 'spiral1' : 'spiral2';
      const params = config.spiralParams[spiralKey];
      if (params) {
        parts.push(`R:${params.R || 120} r:${params.r || 30} d:${params.d || 50}`);
      }
    }
    
    // Add camera info if available
    if (config.camera && config.camera.position) {
      const distance = Math.sqrt(
        config.camera.position[0] ** 2 + 
        config.camera.position[1] ** 2 + 
        config.camera.position[2] ** 2
      ).toFixed(0);
      parts.push(`📷 Dist: ${distance}`);
    }
    
    return parts.slice(0, 3).join(' | '); // Show max 3 parameters including camera
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid rgba(255, 204, 68, 0.3)',
      padding: '10px 20px',
      zIndex: 1000,
      maxHeight: '120px',
      overflowY: 'auto'
    }}>
      {/* Control Buttons */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '10px',
        alignItems: 'center'
      }}>
        <motion.button
          onClick={handleSaveSnapshot}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'linear-gradient(45deg, #d3b166, #ffcc44)',
            color: '#000',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontFamily: 'monospace'
          }}
        >
          📸 Save Snapshot
        </motion.button>
        
        <motion.button
          onClick={onRestoreDefaults}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#ffcc44',
            border: '1px solid rgba(255, 204, 68, 0.5)',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer',
            fontFamily: 'monospace'
          }}
        >
          🔄 Restore Defaults
        </motion.button>

        <div style={{
          color: '#ffcc44',
          fontSize: '12px',
          fontFamily: 'monospace',
          marginLeft: '10px'
        }}>
          Snapshots: {snapshots.length}/20
          {snapshots.length > 0 && (
            <span style={{ marginLeft: '10px', opacity: 0.7 }}>
              (Multiple per demo type allowed)
            </span>
          )}
        </div>
      </div>

      {/* Snapshots List */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '5px'
      }}>
        <AnimatePresence>
          {snapshots.map((snapshot) => (
            <motion.div
              key={snapshot.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              style={{
                minWidth: '140px',
                background: 'rgba(211, 177, 102, 0.1)',
                border: '1px solid rgba(211, 177, 102, 0.3)',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
              onClick={() => onLoadSnapshot(snapshot)}
            >
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSnapshot(snapshot.id);
                }}
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  background: 'rgba(255, 0, 0, 0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  fontSize: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>

              {/* Demo Icon with Counter */}
              <div style={{ marginBottom: '4px', position: 'relative' }}>
                {getDemoIcon(snapshot.demo)}
                {/* Show count if multiple snapshots of same demo type exist */}
                {(() => {
                  const sameTypeSnapshots = snapshots.filter(s => s.demo === snapshot.demo);
                  const snapshotIndex = sameTypeSnapshots.findIndex(s => s.id === snapshot.id) + 1;
                  return sameTypeSnapshots.length > 1 ? (
                    <div style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      background: '#d3b166',
                      color: '#000',
                      borderRadius: '50%',
                      width: '12px',
                      height: '12px',
                      fontSize: '8px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'monospace'
                    }}>
                      {snapshotIndex}
                    </div>
                  ) : null;
                })()}
              </div>

              {/* Demo Name */}
              <div style={{
                color: '#d3b166',
                fontSize: '10px',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '2px',
                fontFamily: 'monospace'
              }}>
                {snapshot.demo.replace('_', ' ').toUpperCase()}
              </div>

              {/* Config Summary */}
              <div style={{
                color: '#ecffff',
                fontSize: '8px',
                textAlign: 'center',
                lineHeight: '1.2',
                fontFamily: 'monospace'
              }}>
                {getConfigSummary(snapshot.config)}
              </div>

              {/* Timestamp */}
              <div style={{
                color: '#888',
                fontSize: '7px',
                marginTop: '2px',
                fontFamily: 'monospace'
              }}>
                {snapshot.timestamp}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SnapshotManager; 