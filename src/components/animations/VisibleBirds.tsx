import React from 'react';
import { motion } from 'framer-motion';

const VisibleBirds: React.FC = () => {
  const birds = [
    { id: 1, initialX: -100, y: 80, delay: 0, duration: 15 },
    { id: 2, initialX: -150, y: 120, delay: 2, duration: 18 },
    { id: 3, initialX: -200, y: 60, delay: 4, duration: 12 },
    { id: 4, initialX: -120, y: 100, delay: 6, duration: 20 },
    { id: 5, initialX: -180, y: 140, delay: 8, duration: 16 }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {birds.map((bird) => (
        <motion.div
          key={bird.id}
          className="absolute"
          style={{ 
            left: `${bird.initialX}px`, 
            top: `${bird.y}px`,
            width: '40px',
            height: '20px'
          }}
          animate={{
            x: [0, window.innerWidth + 200],
            y: [0, -20, 10, -10, 0]
          }}
          transition={{
            x: {
              duration: bird.duration,
              delay: bird.delay,
              repeat: Infinity,
              ease: "linear"
            },
            y: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <motion.svg
            width="40"
            height="20"
            viewBox="0 0 40 20"
            animate={{
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Bird body */}
            <circle cx="20" cy="10" r="3" fill="#2d3748" />
            
            {/* Left wing */}
            <motion.path
              d="M 20 10 Q 10 8 5 10"
              stroke="#2d3748"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              animate={{
                d: [
                  "M 20 10 Q 10 8 5 10",
                  "M 20 10 Q 10 12 5 10",
                  "M 20 10 Q 10 8 5 10"
                ]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Right wing */}
            <motion.path
              d="M 20 10 Q 30 8 35 10"
              stroke="#2d3748"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              animate={{
                d: [
                  "M 20 10 Q 30 8 35 10",
                  "M 20 10 Q 30 12 35 10",
                  "M 20 10 Q 30 8 35 10"
                ]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.svg>
        </motion.div>
      ))}
    </div>
  );
};

export default VisibleBirds;
