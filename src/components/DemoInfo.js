import React from 'react';
import { motion } from 'framer-motion';

const DemoInfo = ({ demo, isVisible }) => {
  if (!demo) return null;

  return (
    <motion.div
      className={`demo-info ${isVisible ? 'visible' : ''}`}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 100 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {demo.title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        {demo.description}
      </motion.p>
      
      <motion.div
        className="demo-specs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: 'rgba(211, 177, 102, 0.1)',
          borderRadius: '0.5rem',
          border: '1px solid rgba(211, 177, 102, 0.2)'
        }}
      >
        <div style={{ fontSize: '0.8rem', color: '#d3b166', marginBottom: '0.5rem' }}>
          Performance Highlights:
        </div>
        {getPerformanceSpecs(demo.id)}
      </motion.div>
    </motion.div>
  );
};

const getPerformanceSpecs = (demoId) => {
  const specs = {
    puncture: [
      '• Superior puncture resistance',
      '• Withstands sharp objects',
      '• Maintains integrity under pressure'
    ],
    stretch: [
      '• Unprecedented elasticity',
      '• Stretches further without tearing',
      '• Reduced material usage'
    ],
    cling: [
      '• Enhanced adhesion formula',
      '• Secure adherence',
      '• Prevents unwrapping during transport'
    ],
    retention: [
      '• Long-term holding power',
      '• Maintains tight bundling',
      '• Ideal for extended storage'
    ]
  };

  return (
    <div style={{ fontSize: '0.75rem', color: '#ecffff', lineHeight: '1.4' }}>
      {specs[demoId]?.map((spec, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
        >
          {spec}
        </motion.div>
      ))}
    </div>
  );
};

export default DemoInfo; 