import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Smartphone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const CTASection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-primary-glow to-secondary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      {/* Floating Elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 right-10 w-32 h-32 rounded-full border-4 border-white/10 hidden lg:block"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-10 left-10 w-48 h-48 rounded-full border-4 border-white/5 hidden lg:block"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6"
          >
            <Smartphone className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Works on any smartphone</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6"
          >
            {t('getStarted')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto"
          >
            {t('heroSubtitle')}
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-10"
          >
            {['No Hardware Needed', 'Works Offline', 'Hindi Support', 'Free Forever'].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-white">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/signup">
              <Button
                size="xl"
                className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl font-bold"
              >
                <Leaf className="w-5 h-5" />
                {t('getStarted')}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="outline"
                size="xl"
                className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                {t('learnMoreBtn')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
