import React, { useEffect, useRef, useState } from 'react';

interface Bird {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  wingPhase: number;
  amplitude: number;
  opacity: number;
}

const FlyingBirds: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [birds, setBirds] = useState<Bird[]>([]);
  const animationRef = useRef<number>();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    // Determine bird count based on screen size
    const getBirdCount = () => {
      const width = window.innerWidth;
      if (width < 768) return 2; // Mobile
      if (width < 1024) return 4; // Tablet
      return 6; // Desktop
    };

    // Initialize birds
    const initBirds = () => {
      const birdCount = getBirdCount();
      const newBirds: Bird[] = [];

      for (let i = 0; i < birdCount; i++) {
        newBirds.push({
          id: i,
          x: Math.random() * canvas.width - canvas.width, // Start from left
          y: 50 + Math.random() * (canvas.height * 0.4), // Upper portion of screen
          speed: 0.3 + Math.random() * 0.7, // Varied speeds
          size: 12 + Math.random() * 8, // Larger sizes for better visibility
          wingPhase: Math.random() * Math.PI * 2,
          amplitude: 5 + Math.random() * 10, // Flight path variation
          opacity: 0.6 + Math.random() * 0.4 // More visible opacity
        });
      }
      setBirds(newBirds);
      return newBirds;
    };

    let currentBirds = initBirds();

    // Draw bird shape
    const drawBird = (bird: Bird) => {
      ctx.save();
      ctx.globalAlpha = bird.opacity;
      ctx.strokeStyle = '#2d3748'; // Darker color for better visibility
      ctx.lineWidth = 2; // Thicker lines
      ctx.lineCap = 'round';

      const wingOffset = Math.sin(bird.wingPhase) * 3;
      
      // Calculate bird position with gentle wave motion
      const waveY = Math.sin(bird.x * 0.003) * bird.amplitude;
      const birdY = bird.y + waveY;

      // Left wing
      ctx.beginPath();
      ctx.moveTo(bird.x - bird.size, birdY + wingOffset);
      ctx.quadraticCurveTo(
        bird.x - bird.size * 0.5, 
        birdY, 
        bird.x, 
        birdY
      );
      ctx.stroke();

      // Right wing
      ctx.beginPath();
      ctx.moveTo(bird.x + bird.size, birdY + wingOffset);
      ctx.quadraticCurveTo(
        bird.x + bird.size * 0.5, 
        birdY, 
        bird.x, 
        birdY
      );
      ctx.stroke();

      // Small body
      ctx.beginPath();
      ctx.arc(bird.x, birdY, bird.size * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#2d3748';
      ctx.fill();

      ctx.restore();
    };

    // Animation loop
    const animate = () => {
      if (!isVisible) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Clear canvas with a slight tint to see if it's working
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw birds
      currentBirds = currentBirds.map(bird => {
        // Update position
        bird.x += bird.speed;
        bird.wingPhase += 0.15; // Wing flapping speed

        // Reset bird when it goes off screen
        if (bird.x > canvas.width + 50) {
          bird.x = -50;
          bird.y = 50 + Math.random() * (canvas.height * 0.4);
          bird.speed = 0.3 + Math.random() * 0.7;
        }

        return bird;
      });

      // Draw all birds
      currentBirds.forEach(drawBird);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      resizeCanvas();
      currentBirds = initBirds();
    };

    // Handle visibility change for performance
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ opacity: 1 }}
    />
  );
};

export default FlyingBirds;
