import React from 'react';
import { motion } from 'framer-motion';

const WheatField: React.FC = () => {
  const wheatStalks = Array.from({ length: 15 }, (_, i) => i);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none">
      <svg
        className="w-full h-full"
        viewBox="0 0 1200 128"
        preserveAspectRatio="none"
      >
        {wheatStalks.map((index) => {
          const x = (index / wheatStalks.length) * 1200;
          const height = 60 + Math.random() * 40;
          const delay = Math.random() * 2;
          
          return (
            <motion.g key={index} transform={`translate(${x}, 0)`}>
              {/* Wheat stalk */}
              <motion.path
                d={`M 0,128 Q ${Math.random() * 10 - 5},${128 - height} ${Math.random() * 10 - 5},${128 - height - 20}`}
                stroke="#8B7355"
                strokeWidth="2"
                fill="none"
                animate={{
                  pathLength: [0, 1],
                }}
                transition={{
                  duration: 2,
                  delay: delay,
                  ease: "easeOut"
                }}
              />
              
              {/* Wheat heads */}
              {[0, 1, 2].map((grainIndex) => (
                <motion.circle
                  key={grainIndex}
                  cx={Math.random() * 10 - 5}
                  cy={128 - height - 20 + grainIndex * 5}
                  r="3"
                  fill="#DAA520"
                  animate={{
                    scale: [0, 1, 0.9, 1],
                    opacity: [0, 1, 0.8, 1]
                  }}
                  transition={{
                    duration: 3,
                    delay: delay + grainIndex * 0.1,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                />
              ))}
              
              {/* Animated sway */}
              <motion.animateTransform
                attributeName="transform"
                type="rotate"
                values={`0 0 128; ${Math.random() * 10 - 5} 0 128; 0 0 128`}
                dur={`${3 + Math.random() * 2}s`}
                repeatCount="indefinite"
                begin={delay + 's'}
              />
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
};

export default WheatField;
