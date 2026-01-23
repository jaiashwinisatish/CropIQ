import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const FarmBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Animated elements
    const clouds: Array<{ x: number; y: number; speed: number; size: number }> = [];
    const birds: Array<{ x: number; y: number; speed: number; wingPhase: number }> = [];
    const particles: Array<{ x: number; y: number; speed: number; opacity: number; size: number }> = [];

    // Initialize clouds
    for (let i = 0; i < 3; i++) {
      clouds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height * 0.3),
        speed: 0.2 + Math.random() * 0.3,
        size: 60 + Math.random() * 40
      });
    }

    // Initialize birds
    for (let i = 0; i < 5; i++) {
      birds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height * 0.4),
        speed: 1 + Math.random() * 2,
        wingPhase: Math.random() * Math.PI * 2
      });
    }

    // Initialize floating particles (pollen/dust)
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.1 + Math.random() * 0.3,
        opacity: 0.1 + Math.random() * 0.3,
        size: 1 + Math.random() * 2
      });
    }

    const drawCloud = (x: number, y: number, size: number) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      
      // Draw cloud with multiple circles
      for (let i = 0; i < 6; i++) {
        const offsetX = Math.cos(i * 0.5) * size * 0.3;
        const offsetY = Math.sin(i * 0.3) * size * 0.2;
        const radius = size * (0.3 + Math.random() * 0.2);
        
        ctx.arc(x + offsetX, y + offsetY, radius, 0, Math.PI * 2);
      }
      ctx.fill();
    };

    const drawBird = (x: number, y: number, wingPhase: number) => {
      ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
      ctx.lineWidth = 2;
      
      const wingOffset = Math.sin(wingPhase) * 5;
      
      // Left wing
      ctx.beginPath();
      ctx.moveTo(x - 10, y + wingOffset);
      ctx.quadraticCurveTo(x - 5, y, x, y);
      ctx.stroke();
      
      // Right wing
      ctx.beginPath();
      ctx.moveTo(x + 10, y + wingOffset);
      ctx.quadraticCurveTo(x + 5, y, x, y);
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw clouds
      clouds.forEach(cloud => {
        cloud.x += cloud.speed;
        if (cloud.x > canvas.width + cloud.size) {
          cloud.x = -cloud.size;
        }
        drawCloud(cloud.x, cloud.y, cloud.size);
      });

      // Update and draw birds
      birds.forEach(bird => {
        bird.x += bird.speed;
        bird.wingPhase += 0.2;
        
        if (bird.x > canvas.width + 20) {
          bird.x = -20;
          bird.y = Math.random() * (canvas.height * 0.4);
        }
        drawBird(bird.x, bird.y, bird.wingPhase);
      });

      // Update and draw particles
      particles.forEach(particle => {
        particle.x += particle.speed;
        particle.y += Math.sin(particle.x * 0.01) * 0.5;
        
        if (particle.x > canvas.width) {
          particle.x = 0;
          particle.y = Math.random() * canvas.height;
        }
        
        ctx.fillStyle = `rgba(255, 220, 100, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
};

export default FarmBackground;
