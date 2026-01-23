import React, { useEffect, useRef } from 'react';

const SimpleBirds: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Simple bird data
    const birds = [
      { x: 100, y: 100, speed: 1, size: 20, wingPhase: 0 },
      { x: 300, y: 150, speed: 0.8, size: 15, wingPhase: 1 },
      { x: 500, y: 80, speed: 1.2, size: 18, wingPhase: 2 },
      { x: 700, y: 120, speed: 0.9, size: 16, wingPhase: 3 },
      { x: 900, y: 90, speed: 1.1, size: 19, wingPhase: 4 }
    ];

    let animationId: number;

    const drawBird = (bird: any) => {
      ctx.save();
      
      // Dark color for visibility
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';

      const wingOffset = Math.sin(bird.wingPhase) * 5;

      // Draw simple V-shaped bird
      ctx.beginPath();
      ctx.moveTo(bird.x - bird.size, bird.y + wingOffset);
      ctx.lineTo(bird.x, bird.y);
      ctx.lineTo(bird.x + bird.size, bird.y + wingOffset);
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw birds
      birds.forEach(bird => {
        bird.x += bird.speed;
        bird.wingPhase += 0.1;

        // Reset position
        if (bird.x > canvas.width + 50) {
          bird.x = -50;
        }

        drawBird(bird);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ 
        zIndex: 5,
        opacity: 1,
        background: 'transparent'
      }}
    />
  );
};

export default SimpleBirds;
