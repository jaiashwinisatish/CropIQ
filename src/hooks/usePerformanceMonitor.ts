import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage?: number;
  isLowPerformance: boolean;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    isLowPerformance: false
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // Check memory usage if available
        let memoryUsage: number | undefined;
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          memoryUsage = Math.round((memory.usedJSHeapSize / 1048576)); // Convert to MB
        }

        // Determine if performance is low
        const isLowPerformance = fps < 30 || (memoryUsage && memoryUsage > 100);

        setMetrics({ fps, memoryUsage, isLowPerformance });
        
        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measureFPS);
    };

    measureFPS();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return metrics;
};

export default usePerformanceMonitor;
