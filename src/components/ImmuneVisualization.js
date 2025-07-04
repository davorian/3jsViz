import React, { useRef, useEffect, useState } from 'react';

const ImmuneVisualization = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const dotsRef = useRef([]);
  
  // State for sliders
  const [inflamaging, setInflamaging] = useState(0.3);
  const [dotSize, setDotSize] = useState(0.5);
  const [protectionScore, setProtectionScore] = useState(0.8);
  const [immuneAge, setImmuneAge] = useState(0.5);
  const [cellularDamage, setCellularDamage] = useState(0.4);

  const DOT_COUNT = 500;

  // Initialize dots
  const initializeDots = (canvas) => {
    const dots = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < DOT_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 200 + 50;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      dots.push({
        x, y,
        baseX: x,
        baseY: y,
        angle,
        radius,
        r: 0.5 + immuneAge * 1.5,
        halo: protectionScore * 20,
        speed: 0.5 + inflamaging * 3,
        offset: Math.random() * 1000
      });
    }
    return dots;
  };

  // Update dot parameters based on slider values
  const updateParams = () => {
    dotsRef.current.forEach(dot => {
      dot.r = (0.5 + immuneAge * 1.5) * (1 + dotSize * 2);
      dot.halo = protectionScore * 20;
      dot.speed = 5 + inflamaging * 80;
    });
  };

  // Animation loop
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dots = dotsRef.current;

    // Clear with trail effect
    ctx.fillStyle = `rgba(0, 0, 0, ${0.05 + inflamaging * 0.1})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 1.0;

    // Draw and animate dots
    dots.forEach(dot => {
      const time = Date.now() * 0.001 + dot.offset;
      
      const intensity = 0.15 + protectionScore * 0.5 + inflamaging * 0.2;
      ctx.strokeStyle = `rgba(255,255,255,${Math.min(intensity, 1)})`;

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.r + cellularDamage * 2, 0, Math.PI * 2);
      ctx.stroke();

      // Update position with oscillation
      dot.x = dot.baseX + Math.cos(time + dot.angle) * (cellularDamage * 20);
      dot.y = dot.baseY + Math.sin(time + dot.angle) * (cellularDamage * 20);
    });

    // Collision detection and bounce
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const a = dots[i];
        const b = dots[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = (a.r + cellularDamage * 2) + (b.r + cellularDamage * 2);

        if (dist < minDist) {
          const angle = Math.atan2(dy, dx);
          const overlap = 0.5 * (minDist - dist);
          const ax = Math.cos(angle) * overlap;
          const ay = Math.sin(angle) * overlap;

          a.x -= ax;
          a.y -= ay;
          b.x += ax;
          b.y += ay;
        }
      }
    }

    animationRef.current = requestAnimationFrame(draw);
  };

  // Initialize canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Reinitialize dots with new canvas size
      dotsRef.current = initializeDots(canvas);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Start animation
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Update parameters when sliders change
  useEffect(() => {
    updateParams();
  }, [inflamaging, dotSize, protectionScore, immuneAge, cellularDamage]);

  const sliderStyle = {
    width: '200px',
    margin: '5px 0'
  };

  const controlPanelStyle = {
    position: 'fixed',
    top: '10px',
    left: '10px',
    background: 'rgba(255,255,255,0.9)',
    padding: '15px',
    borderRadius: '10px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    zIndex: 1000
  };

  const canvasStyle = {
    display: 'block',
    background: '#000000',
    width: '100%',
    height: '100%'
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <canvas 
        ref={canvasRef} 
        style={canvasStyle}
      />
      
      <div style={controlPanelStyle}>
        <div>
          <label>
            Inflamaging: {inflamaging.toFixed(2)}
            <br />
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={inflamaging}
              onChange={(e) => setInflamaging(parseFloat(e.target.value))}
              style={sliderStyle}
            />
          </label>
        </div>
        
        <div>
          <label>
            Dot Size: {dotSize.toFixed(2)}
            <br />
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={dotSize}
              onChange={(e) => setDotSize(parseFloat(e.target.value))}
              style={sliderStyle}
            />
          </label>
        </div>
        
        <div>
          <label>
            Protection Score: {protectionScore.toFixed(2)}
            <br />
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={protectionScore}
              onChange={(e) => setProtectionScore(parseFloat(e.target.value))}
              style={sliderStyle}
            />
          </label>
        </div>
        
        <div>
          <label>
            Immune Age: {immuneAge.toFixed(2)}
            <br />
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={immuneAge}
              onChange={(e) => setImmuneAge(parseFloat(e.target.value))}
              style={sliderStyle}
            />
          </label>
        </div>
        
        <div>
          <label>
            Cellular Damage: {cellularDamage.toFixed(2)}
            <br />
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={cellularDamage}
              onChange={(e) => setCellularDamage(parseFloat(e.target.value))}
              style={sliderStyle}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ImmuneVisualization; 