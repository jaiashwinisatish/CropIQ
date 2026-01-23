import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Mail, Phone, MapPin, Sprout, Droplets, Sun, Wind } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-card border-t border-border relative overflow-hidden">
      {/* Subtle Background Animation */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`footer-particle-${i}`}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              top: `${10 + Math.random() * 80}%`,
              left: `${5 + Math.random() * 90}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Enhanced Brand Section */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </motion.div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl">{t('appName')}</span>
                <span className="text-[10px] text-muted-foreground -mt-1">{t('tagline')}</span>
              </div>
            </motion.div>
            <motion.p 
              className="text-muted-foreground text-sm leading-relaxed"
              whileHover={{ scale: 1.02 }}
            >
              {t('heroSubtitle')}
            </motion.p>
          </motion.div>

          {/* Enhanced Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.h4 
              className="font-semibold text-foreground mb-4 flex items-center gap-2"
              whileHover={{ x: 5 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sprout className="w-4 h-4 text-primary" />
              </motion.div>
              Quick Links
            </motion.h4>
            <ul className="space-y-2">
              {[{ label: t('dashboard'), path: '/dashboard' }, 
                { label: t('advisory'), path: '/advisory' }, 
                { label: t('planning'), path: '/planning' }, 
                { label: t('about'), path: '/about' }].map((item, index) => (
                <motion.li key={item.path}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link
                      to={item.path}
                      className="text-muted-foreground hover:text-primary text-sm transition-colors inline-flex items-center gap-1"
                    >
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          delay: index * 0.2 
                        }}
                      >
                        •
                      </motion.span>
                      {item.label}
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Enhanced For Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.h4 
              className="font-semibold text-foreground mb-4 flex items-center gap-2"
              whileHover={{ x: 5 }}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Droplets className="w-4 h-4 text-primary" />
              </motion.div>
              For Users
            </motion.h4>
            <ul className="space-y-2">
              {['Farmers', 'FPOs', 'Agri-Enterprises', 'Government Bodies', 'NGOs'].map((item, index) => (
                <motion.li key={item}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link
                      to="/about"
                      className="text-muted-foreground hover:text-primary text-sm transition-colors inline-flex items-center gap-1"
                    >
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          delay: index * 0.3 
                        }}
                      >
                        •
                      </motion.span>
                      {item}
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Enhanced Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.h4 
              className="font-semibold text-foreground mb-4 flex items-center gap-2"
              whileHover={{ x: 5 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sun className="w-4 h-4 text-primary" />
              </motion.div>
              Contact
            </motion.h4>
            <ul className="space-y-3">
              <motion.li 
                className="flex items-center gap-2 text-muted-foreground text-sm"
                whileHover={{ scale: 1.05, x: 5 }}
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Mail className="w-4 h-4 text-primary" />
                </motion.div>
                support@cropiq.in
              </motion.li>
              <motion.li 
                className="flex items-center gap-2 text-muted-foreground text-sm"
                whileHover={{ scale: 1.05, x: 5 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Phone className="w-4 h-4 text-primary" />
                </motion.div>
                1800-XXX-XXXX (Toll Free)
              </motion.li>
              <motion.li 
                className="flex items-start gap-2 text-muted-foreground text-sm"
                whileHover={{ scale: 1.05, x: 5 }}
              >
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <MapPin className="w-4 h-4 text-primary mt-0.5" />
                </motion.div>
                <span>AgriTech Hub, Gurugram,<br />Haryana, India</span>
              </motion.li>
            </ul>
          </motion.div>
        </div>

        {/* Enhanced Bottom Section */}
        <motion.div 
          className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.p 
            className="text-muted-foreground text-sm flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            © 2025 CropIQ. 
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            >
              💚
            </motion.div>
            Made with for Indian farmers.
          </motion.p>
          <div className="flex items-center gap-4">
            {['Privacy Policy', 'Terms of Service'].map((item, index) => (
              <motion.div
                key={item}
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link 
                  to={item === 'Privacy Policy' ? '/privacy' : '/terms'} 
                  className="text-muted-foreground hover:text-primary text-sm inline-flex items-center gap-1"
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      delay: index * 0.5,
                      ease: "easeInOut" 
                    }}
                  >
                    <Wind className="w-3 h-3" />
                  </motion.div>
                  {item}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
