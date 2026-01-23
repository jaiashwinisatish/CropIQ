import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Satellite, Cloud, TrendingUp, Leaf, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import FarmBackground from '@/components/animations/FarmBackground';
import FloatingElements from '@/components/animations/FloatingElements';
import WheatField from '@/components/animations/WheatField';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background Canvas */}
      <FarmBackground />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-soft/20 via-background/50 to-accent-soft/20" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-satellite-grid opacity-30" />
      
      {/* Floating Farm Elements */}
      <FloatingElements />
      
      {/* Enhanced Floating Icons with more animations */}
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          rotate: [0, 5, -5, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-1/4 left-[10%] w-20 h-20 rounded-2xl bg-primary/10 backdrop-blur-sm flex items-center justify-center border border-primary/20 shadow-lg hidden lg:flex"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Satellite className="w-10 h-10 text-primary" />
        </motion.div>
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [0, 25, 0],
          x: [0, 10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 7, 
          repeat: Infinity, 
          ease: "easeInOut", 
          delay: 0.5 
        }}
        className="absolute top-1/3 right-[15%] w-16 h-16 rounded-2xl bg-accent/10 backdrop-blur-sm flex items-center justify-center border border-accent/20 shadow-lg hidden lg:flex"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Cloud className="w-8 h-8 text-accent" />
        </motion.div>
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, -3, 3, 0],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity, 
          ease: "easeInOut", 
          delay: 1 
        }}
        className="absolute bottom-1/3 left-[20%] w-14 h-14 rounded-xl bg-success/10 backdrop-blur-sm flex items-center justify-center border border-success/20 shadow-lg hidden lg:flex"
      >
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        >
          <TrendingUp className="w-7 h-7 text-success" />
        </motion.div>
      </motion.div>

      {/* Animated Sparkles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-1 h-1 bg-primary rounded-full"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeOut"
          }}
        >
          <Sparkles className="w-4 h-4 text-primary" />
        </motion.div>
      ))}

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Enhanced Badge with glow effect */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-6 shadow-lg backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm font-medium text-primary">No Hardware • No Sensors • Just AI</span>
          </motion.div>

          {/* Enhanced Animated Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6"
          >
            {t('heroTitle').split(' ').map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: "spring"
                }}
                className={index === 1 ? "text-gradient-primary inline-block" : "inline-block"}
                whileHover={{ 
                  scale: 1.1,
                  color: index === 1 ? undefined : "hsl(var(--primary))"
                }}
              >
                {word}{' '}
              </motion.span>
            ))}
          </motion.h1>

          {/* Enhanced Subtitle with typewriter effect */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            {t('heroSubtitle')}
          </motion.p>

          {/* Enhanced CTA Buttons with hover effects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/signup">
                <Button variant="hero" size="xl" className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300">
                  {t('getStartedNow')}
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/dashboard">
                <Button variant="outline" size="xl" className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Leaf className="w-5 h-5" />
                  </motion.div>
                  {t('learnMoreBtn')}
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Enhanced Trust Indicators with animations */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            {[
              { label: "10,000+ Farmers", color: "bg-success" },
              { label: "50+ FPOs", color: "bg-primary" },
              { label: "15+ States", color: "bg-accent" }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  className={`w-2 h-2 rounded-full ${item.color}`}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                />
                <span>{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Enhanced Bottom Wave with animation */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
      >
        <svg viewBox="0 0 1440 120" className="w-full h-20 md:h-32 fill-background">
          <motion.path
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            animate={{
              d: [
                "M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z",
                "M0,48L48,53.3C96,59,192,69,288,64C384,59,480,37,576,32C672,27,768,37,864,48C960,59,1056,69,1152,64C1248,59,1344,37,1392,26.7L1440,16L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z",
                "M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>

      {/* Wheat Field Animation */}
      <WheatField />
    </section>
  );
};

export default HeroSection;
