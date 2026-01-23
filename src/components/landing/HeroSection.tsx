import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Satellite, Cloud, TrendingUp, Leaf, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-soft via-background to-accent-soft" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-satellite-grid opacity-50" />
      
      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-[10%] w-16 h-16 rounded-2xl bg-primary/10 backdrop-blur-sm flex items-center justify-center border border-primary/20 hidden lg:flex"
      >
        <Satellite className="w-8 h-8 text-primary" />
      </motion.div>
      
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-1/3 right-[15%] w-14 h-14 rounded-2xl bg-accent/10 backdrop-blur-sm flex items-center justify-center border border-accent/20 hidden lg:flex"
      >
        <Cloud className="w-7 h-7 text-accent" />
      </motion.div>
      
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/3 left-[20%] w-12 h-12 rounded-xl bg-success/10 backdrop-blur-sm flex items-center justify-center border border-success/20 hidden lg:flex"
      >
        <TrendingUp className="w-6 h-6 text-success" />
      </motion.div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">No Hardware • No Sensors • Just AI</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6"
          >
            {t('heroTitle').split(' ').map((word, index) => (
              <span key={index}>
                {word}{' '}
                {index === 1 && <span className="text-gradient-primary">{word}</span>}
              </span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            {t('heroSubtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/signup">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                {t('getStartedNow')}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                <Leaf className="w-5 h-5" />
                {t('learnMoreBtn')}
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span>10,000+ Farmers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>50+ FPOs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span>15+ States</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-20 md:h-32 fill-background">
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
