import React from 'react';
import { motion } from 'framer-motion';

interface FloatingElementProps {
  children: React.ReactNode;
  delay: number;
  duration: number;
  className?: string;
}

const FloatingElement: React.FC<FloatingElementProps> = ({ 
  children, 
  delay, 
  duration, 
  className = "" 
}) => (
  <motion.div
    className={`absolute pointer-events-none ${className}`}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
);

const FloatingElements: React.FC = () => {
  return (
    <>
      {/* Floating leaf */}
      <FloatingElement delay={0} duration={4} className="top-20 left-10 opacity-20">
        <svg width="30" height="30" viewBox="0 0 30 30">
          <path
            d="M15 5 Q20 15 15 25 Q10 15 15 5"
            fill="#4CAF50"
            opacity="0.6"
          />
        </svg>
      </FloatingElement>

      {/* Floating butterfly */}
      <FloatingElement delay={1} duration={5} className="top-32 right-20 opacity-30">
        <svg width="25" height="25" viewBox="0 0 25 25">
          <ellipse cx="10" cy="12" rx="8" ry="4" fill="#FF9800" opacity="0.7" />
          <ellipse cx="15" cy="12" rx="8" ry="4" fill="#FF9800" opacity="0.7" />
          <rect x="12" y="10" width="2" height="5" fill="#795548" />
        </svg>
      </FloatingElement>

      {/* Floating tractor icon */}
      <FloatingElement delay={2} duration={6} className="bottom-40 left-5 opacity-25">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <rect x="5" y="20" width="20" height="10" fill="#8B4513" />
          <rect x="15" y="15" width="10" height="5" fill="#A0522D" />
          <circle cx="10" cy="32" r="4" fill="#333" />
          <circle cx="20" cy="32" r="4" fill="#333" />
        </svg>
      </FloatingElement>

      {/* Floating sun ray */}
      <FloatingElement delay={3} duration={7} className="top-16 right-32 opacity-20">
        <svg width="35" height="35" viewBox="0 0 35 35">
          <circle cx="17" cy="17" r="8" fill="#FFD700" opacity="0.3" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
            <rect
              key={index}
              x="16"
              y="2"
              width="2"
              height="8"
              fill="#FFD700"
              opacity="0.4"
              transform={`rotate(${angle} 17 17)`}
            />
          ))}
        </svg>
      </FloatingElement>

      {/* Water ripple effect */}
      <FloatingElement delay={4} duration={8} className="bottom-20 right-10 opacity-15">
        <svg width="50" height="30" viewBox="0 0 50 30">
          <ellipse cx="25" cy="15" rx="20" ry="8" fill="none" stroke="#2196F3" strokeWidth="1" opacity="0.5">
            <animate
              attributeName="rx"
              values="10;25;10"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.5;0.1;0.5"
              dur="3s"
              repeatCount="indefinite"
            />
          </ellipse>
        </svg>
      </FloatingElement>

      {/* Floating seed */}
      <FloatingElement delay={5} duration={4.5} className="top-48 left-32 opacity-25">
        <svg width="20" height="20" viewBox="0 0 20 20">
          <ellipse cx="10" cy="10" rx="6" ry="4" fill="#8D6E63" opacity="0.6" />
        </svg>
      </FloatingElement>
    </>
  );
};

export default FloatingElements;
